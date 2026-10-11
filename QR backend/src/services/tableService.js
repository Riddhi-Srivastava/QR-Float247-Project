const crypto = require("crypto");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const createTable = async ({ number, restaurantId }) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return await prisma.restaurantTable.create({
    data: {
      id: crypto.randomUUID(),
      number,
      restaurantId,
    },
  });
};

const getTables = async (restaurantId) => {
  return await prisma.restaurantTable.findMany({
    where: { restaurantId },
    orderBy: {
      number: "asc",
    },
  });
};

const updateTableStatus = async (id, status) => {
  try {
    return await prisma.restaurantTable.update({
      where: { id },
      data: { status },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("Table not found");
    }
    throw error;
  }
};
module.exports = {
  createTable,
  getTables,
  updateTableStatus,
};