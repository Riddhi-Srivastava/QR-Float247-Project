const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Admin Dashboard
const dashboard = async (req, res) => {
  try {
    const [
      users,
      restaurants,
      foods,
      orders,
      tables,
      payments,
      reviews,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.restaurant.count(),
      prisma.foodItem.count(),
      prisma.order.count(),
      prisma.table.count(),
      prisma.payment.count(),
      prisma.review.count(),
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        users,
        restaurants,
        foods,
        orders,
        tables,
        payments,
        reviews,
      },
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("Admin users error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        restaurant: true,
        statusHistory: true,
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Admin orders error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  dashboard,
  getUsers,
  getOrders,
};