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

// Add Staff
const createStaff = async (data) => {
  const {
    userId,
    restaurantId,
    role,
  } = data;

  if (!userId || !restaurantId) {
    throw new Error("userId and restaurantId are required");
  }

  const existing = await prisma.staff.findUnique({
    where: {
      userId,
    },
  });

  if (existing) {
    throw new Error("User is already staff");
  }

  return prisma.staff.create({
    data: {
      id: crypto.randomUUID(),
      userId,
      restaurantId,
      role: role || "STAFF",
    },
  });
};

// Get Staff
const getStaff = async (restaurantId) => {
  return prisma.staff.findMany({
    where: {
      restaurantId,
    },
    include: {
      user: true,
    },
  });
};

// Update Staff Role
const updateStaffRole = async (staffId, role) => {
  const staff = await prisma.staff.findUnique({
    where: {
      id: staffId,
    },
  });

  if (!staff) {
    throw new Error("Staff not found");
  }

  return prisma.staff.update({
    where: {
      id: staffId,
    },
    data: {
      role,
    },
  });
};

// Remove Staff
const deleteStaff = async (staffId) => {
  const staff = await prisma.staff.findUnique({
    where: {
      id: staffId,
    },
  });

  if (!staff) {
    throw new Error("Staff not found");
  }

  await prisma.staff.delete({
    where: {
      id: staffId,
    },
  });

  return staff;
};

module.exports = {
  createStaff,
  getStaff,
  updateStaffRole,
  deleteStaff,
};