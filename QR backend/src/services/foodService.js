require("dotenv").config();

const crypto = require("crypto");

const prisma = require("../config/prisma");

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
  const [restaurant, category] = await Promise.all([
    prisma.restaurant.findUnique({ where: { id: restaurantId } }),
    prisma.category.findUnique({ where: { id: categoryId } }),
  ]);

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

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
  try {
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
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("Food item not found");
    }
    throw error;
  }
};

// DELETE FOOD
const deleteFood = async (id) => {
  try {
    await prisma.foodItem.delete({
      where: { id },
    });

    return {
      id,
    };
  } catch (error) {
    if (error.code === "P2025") {
      throw new Error("Food item not found");
    }
    throw error;
  }
};

module.exports = {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
};