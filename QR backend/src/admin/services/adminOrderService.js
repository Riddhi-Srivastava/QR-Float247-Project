require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Get all orders
const getAllOrders = async () => {
  return await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      restaurant: true,
      user: true,
      items: true,
      payment: true,
      statusHistory: true,
    },
  });
};

// Get single order
const getOrderById = async (id) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      restaurant: true,
      user: true,
      items: true,
      payment: true,
      statusHistory: true,
    },
  });
};

// Update order status
const updateOrderStatus = async (id, status) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.update({
      where: { id },
      data: { status },
    });

    await tx.orderStatusHistory.create({
      data: {
        status,
        orderId: id,
      },
    });

    return order;
  });
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};