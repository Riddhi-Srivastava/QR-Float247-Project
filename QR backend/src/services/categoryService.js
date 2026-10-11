require("dotenv").config();

const prisma = require("../config/prisma");

const createCategory = async ({ name, icon, image }) => {
  const existingCategory = await prisma.category.findUnique({
    where: { name },
  });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  return await prisma.category.create({
    data: {
      name,
      icon,
      image,
    },
  });
};

const getCategories = async () => {
  return await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};

const updateCategory = async (id, data) => {
  try {
    return await prisma.category.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.image !== undefined && { image: data.image }),
      },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("Category not found");
    }
    throw error;
  }
};

const deleteCategory = async (id) => {
  try {
    await prisma.category.delete({
      where: { id },
    });

    return { id };
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("Category not found");
    }
    throw error;
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};