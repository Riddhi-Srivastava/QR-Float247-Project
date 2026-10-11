require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalRestaurants,
    totalFoodItems,
    totalOrders,
    totalCoupons,
    activeCoupons,
    completedOrders,
    cancelledOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.restaurant.count(),
    prisma.foodItem.count(),
    prisma.order.count(),
    prisma.coupon.count(),
    prisma.coupon.count({
      where: {
        active: true,
      },
    }),
    prisma.order.count({
      where: {
        status: "COMPLETED",
      },
    }),
    prisma.order.count({
      where: {
        status: "CANCELLED",
      },
    }),
  ]);

  const revenueResult = await prisma.order.aggregate({
    _sum: {
      total: true,
    },
    where: {
      status: "COMPLETED",
    },
  });

  return {
    users: {
      total: totalUsers,
    },

    restaurants: {
      total: totalRestaurants,
    },

    foodItems: {
      total: totalFoodItems,
    },

    orders: {
      total: totalOrders,
      completed: completedOrders,
      cancelled: cancelledOrders,
    },

    coupons: {
      total: totalCoupons,
      active: activeCoupons,
    },

    revenue: {
      total: revenueResult._sum.total || 0,
    },
  };
};

module.exports = {
  getDashboardStats,
};