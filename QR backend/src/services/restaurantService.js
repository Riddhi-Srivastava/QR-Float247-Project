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

// Create Restaurant
const createRestaurant = async (data) => {
  const restaurant = await prisma.restaurant.create({
    data: {
      id: crypto.randomUUID(),
      name: data.name,
      tagline: data.tagline,
      cuisine: data.cuisine,
      image: data.image,
      logo: data.logo,
      openTime: data.openTime,
      closeTime: data.closeTime,
      isOpen: data.isOpen ?? true,
      address: data.address,
      phone: data.phone,
      tableCount: data.tableCount,
      costForTwo: data.costForTwo,
      description: data.description,
    },
  });

  return restaurant;
};

// Get All Restaurants
const getRestaurants = async () => {
  return await prisma.restaurant.findMany({
    orderBy: {
      name: "asc",
    },
  });
};

// Get Single Restaurant
const getRestaurantById = async (id) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: { id },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return restaurant;
};

// Update Restaurant
const updateRestaurant = async (id, data) => {
  const existingRestaurant = await prisma.restaurant.findUnique({
    where: { id },
  });

  if (!existingRestaurant) {
    throw new Error("Restaurant not found");
  }

  const restaurant = await prisma.restaurant.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.tagline !== undefined && { tagline: data.tagline }),
      ...(data.cuisine !== undefined && { cuisine: data.cuisine }),
      ...(data.image !== undefined && { image: data.image }),
      ...(data.logo !== undefined && { logo: data.logo }),
      ...(data.openTime !== undefined && { openTime: data.openTime }),
      ...(data.closeTime !== undefined && { closeTime: data.closeTime }),
      ...(data.isOpen !== undefined && { isOpen: data.isOpen }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.tableCount !== undefined && { tableCount: data.tableCount }),
      ...(data.costForTwo !== undefined && {
        costForTwo: data.costForTwo,
      }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
    },
  });

  return restaurant;
};

// Delete Restaurant
const deleteRestaurant = async (id) => {
  const existingRestaurant = await prisma.restaurant.findUnique({
    where: { id },
  });

  if (!existingRestaurant) {
    throw new Error("Restaurant not found");
  }

  await prisma.restaurant.delete({
    where: { id },
  });

  return {
    id,
  };
};

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
};