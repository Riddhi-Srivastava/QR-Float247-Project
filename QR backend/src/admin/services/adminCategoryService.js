const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const getCategories = async () => {
  return prisma.category.findMany({
    include: {
      _count: {
        select: { foodItems: true },
      },
    },
    orderBy: { name: "asc" },
  });
};

const getCategoryById = async (id) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      foodItems: true,
    },
  });
};

const createCategory = async ({ id, name, icon, image }) => {
  return prisma.category.create({
    data: {
      ...(id && { id }),
      name,
      icon,
      image,
    },
  });
};

const updateCategory = async (id, data) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

const deleteCategory = async (id) => {
  return prisma.category.delete({
    where: { id },
  });
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};