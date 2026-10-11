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

// Add Favorite
const addFavorite = async (userId, foodId) => {
  try {
    console.log("USER ID:", userId);
    console.log("FOOD ID:", foodId);

    const food = await prisma.foodItem.findUnique({
      where: {
        id: foodId,
      },
    });

    console.log("FOOD FOUND:", food);

    if (!food) {
      throw new Error("Food item not found");
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_foodId: {
          userId,
          foodId,
        },
      },
    });

    console.log("EXISTING FAVORITE:", existingFavorite);

    if (existingFavorite) {
      throw new Error("Food already in favorites");
    }

    const favorite = await prisma.favorite.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        foodId,
      },
      include: {
        food: true,
      },
    });

    console.log("FAVORITE CREATED:", favorite);

    return favorite;
  } catch (error) {
    console.error("Add favorite service error:", error);
    throw error;
  }
};

// Get User Favorites
const getFavorites = async (userId) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: {
        userId,
      },
      include: {
        food: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return favorites;
  } catch (error) {
    console.error("Get favorites service error:", error);
    throw error;
  }
};

// Remove Favorite
const removeFavorite = async (userId, foodId) => {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_foodId: {
          userId,
          foodId,
        },
      },
    });

    if (!favorite) {
      throw new Error("Favorite not found");
    }

    await prisma.favorite.delete({
      where: {
        userId_foodId: {
          userId,
          foodId,
        },
      },
    });

    return {
      userId,
      foodId,
    };
  } catch (error) {
    console.error("Remove favorite service error:", error);
    throw error;
  }
};

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};