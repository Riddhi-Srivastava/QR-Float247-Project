const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const getRestaurants = async () => {
  return prisma.restaurant.findMany({
    orderBy: { name: "asc" },
  });
};

const getRestaurantById = async (id) => {
  return prisma.restaurant.findUnique({
    where: { id },
    include: {
      foodItems: true,
      tables: true,
    },
  });
};

const createRestaurant = async (data) => {
  return prisma.restaurant.create({
    data: {
      id: data.id,
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
};

const updateRestaurant = async (id, data) => {
  return prisma.restaurant.update({
    where: { id },
    data,
  });
};

const deleteRestaurant = async (id) => {
  return prisma.restaurant.delete({
    where: { id },
  });
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};