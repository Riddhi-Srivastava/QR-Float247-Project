require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Get all food items
const getAllFood = async () => {
  return await prisma.foodItem.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      restaurant: true,
      category: true,
    },
  });
};

// Get single food item
const getFoodById = async (id) => {
  return await prisma.foodItem.findUnique({
    where: { id },
    include: {
      restaurant: true,
      category: true,
    },
  });
};

// Create food item
const createFood = async (data) => {
  const {
    id,
    name,
    description,
    price,
    veg,
    image,
    prepTime,
    available,
    popular,
    featured,
    restaurantId,
    categoryId,
  } = data;

  return await prisma.foodItem.create({
    data: {
      id,
      name,
      description,
      price,
      veg,
      image,
      prepTime,
      available: available ?? true,
      popular: popular ?? false,
      featured: featured ?? false,
      restaurantId,
      categoryId,
    },
  });
};

// Update food item
const updateFood = async (id, data) => {
  return await prisma.foodItem.update({
    where: { id },
    data,
  });
};

// Delete food item
const deleteFood = async (id) => {
  return await prisma.foodItem.delete({
    where: { id },
  });
};

// Change food availability
const updateAvailability = async (id, available) => {
  return await prisma.foodItem.update({
    where: { id },
    data: {
      available,
    },
  });
};

module.exports = {
  getAllFood,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  updateAvailability,
};