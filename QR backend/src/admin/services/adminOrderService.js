require("dotenv").config();
const crypto = require("crypto");
const prisma = require("../../config/prisma");
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
        id: crypto.randomUUID(),
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