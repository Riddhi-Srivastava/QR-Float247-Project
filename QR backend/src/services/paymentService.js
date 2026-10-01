require("dotenv").config();

const crypto = require("crypto");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const createPayment = async ({
  orderId,
  method,
  amount,
  transactionId,
}) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (existingPayment) {
    throw new Error("Payment already exists");
  }

  return await prisma.payment.create({
    data: {
      id: crypto.randomUUID(),
      orderId,
      method,
      amount,
      transactionId: transactionId || null,
      status: "PENDING",
    },
  });
};

const confirmPayment = async (orderId) => {
  const payment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  if (payment.status === "CONFIRMED") {
    throw new Error("Payment already confirmed");
  }

  const updatedPayment = await prisma.payment.update({
    where: { orderId },
    data: {
      status: "CONFIRMED",
    },
  });

  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus: "CONFIRMED",
    },
  });

  return updatedPayment;
};

module.exports = {
  createPayment,
  confirmPayment,
};