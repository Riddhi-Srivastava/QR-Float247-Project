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

// CREATE FOOD
const createFood = async ({
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
}) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id: restaurantId },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  return await prisma.foodItem.create({
    data: {
      id: crypto.randomUUID(),
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

// GET FOODS WITH FILTERS
const getFoods = async ({
  restaurantId,
  categoryId,
  veg,
  available,
} = {}) => {
  const where = {};

  if (restaurantId) {
    where.restaurantId = restaurantId;
  }

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (veg) {
    where.veg = veg;
  }

  if (available !== undefined) {
    where.available = available === "true";
  }

  return await prisma.foodItem.findMany({
    where,
    orderBy: {
      name: "asc",
    },
  });
};

// GET FOOD BY ID
const getFoodById = async (id) => {
  const food = await prisma.foodItem.findUnique({
    where: { id },
  });

  if (!food) {
    throw new Error("Food item not found");
  }

  return food;
};

// UPDATE FOOD
const updateFood = async (id, data) => {
  const existingFood = await prisma.foodItem.findUnique({
    where: { id },
  });

  if (!existingFood) {
    throw new Error("Food item not found");
  }

  return await prisma.foodItem.update({
    where: { id },
    data: {
      ...(data.name !== undefined && {
        name: data.name,
      }),

      ...(data.description !== undefined && {
        description: data.description,
      }),

      ...(data.price !== undefined && {
        price: data.price,
      }),

      ...(data.veg !== undefined && {
        veg: data.veg,
      }),

      ...(data.image !== undefined && {
        image: data.image,
      }),

      ...(data.prepTime !== undefined && {
        prepTime: data.prepTime,
      }),

      ...(data.available !== undefined && {
        available: data.available,
      }),

      ...(data.popular !== undefined && {
        popular: data.popular,
      }),

      ...(data.featured !== undefined && {
        featured: data.featured,
      }),

      ...(data.restaurantId !== undefined && {
        restaurantId: data.restaurantId,
      }),

      ...(data.categoryId !== undefined && {
        categoryId: data.categoryId,
      }),
    },
  });
};

// DELETE FOOD
const deleteFood = async (id) => {
  const existingFood = await prisma.foodItem.findUnique({
    where: { id },
  });

  if (!existingFood) {
    throw new Error("Food item not found");
  }

  await prisma.foodItem.delete({
    where: { id },
  });

  return {
    id,
  };
};

module.exports = {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
};