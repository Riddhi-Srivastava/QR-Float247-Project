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
  const table = await prisma.restaurantTable.findUnique({
    where: { id },
  });

  if (!table) {
    throw new Error("Table not found");
  }

  return await prisma.restaurantTable.update({
    where: { id },
    data: { status },
  });
};

module.exports = {
  createTable,
  getTables,
  updateTableStatus,
};