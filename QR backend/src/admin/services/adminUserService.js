require("dotenv").config();

const prisma = require("../../config/prisma");

// Get all users
const getAllUsers = async () => {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      loyaltyPoints: true,
      totalOrders: true,
      totalSpent: true,
      joinedDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// Get single user
const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      loyaltyPoints: true,
      totalOrders: true,
      totalSpent: true,
      joinedDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// Update user status
const updateUserStatus = async (id, status) => {
  return await prisma.user.update({
    where: { id },
    data: {
      status,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
      loyaltyPoints: true,
      totalOrders: true,
      totalSpent: true,
      joinedDate: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserStatus,
};