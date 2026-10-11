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

// =========================
// Get All Restaurants
// =========================
const getAll = async (req, res) => {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Admin get restaurants error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// =========================
// Create Restaurant
// =========================
const create = async (req, res) => {
  try {
    const {
      name,
      tagline,
      cuisine,
      rating,
      ratingCount,
      openTime,
      closeTime,
      isOpen,
      address,
      phone,
      tableCount,
      costForTwo,
      description,
    } = req.body;

    // Required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Restaurant name is required",
      });
    }

    if (!tagline) {
      return res.status(400).json({
        success: false,
        message: "Restaurant tagline is required",
      });
    }

    // Convert cuisine string into array
    let cuisineArray = [];

    if (Array.isArray(cuisine)) {
      cuisineArray = cuisine;
    } else if (typeof cuisine === "string" && cuisine.trim()) {
      cuisineArray = [cuisine.trim()];
    }

    const restaurant = await prisma.restaurant.create({
      data: {
        id: crypto.randomUUID(),

        name,
        tagline,
        cuisine: cuisineArray,

        rating: rating ?? 0,
        ratingCount: ratingCount ?? 0,

        openTime: openTime || null,
        closeTime: closeTime || null,

        isOpen: isOpen ?? false,

        address: address || null,
        phone: phone || null,

        tableCount: tableCount ?? 0,
        costForTwo: costForTwo ?? 0,

        description: description || null,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Admin create restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// =========================
// Update Restaurant
// =========================
const update = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const {
      name,
      tagline,
      cuisine,
      rating,
      ratingCount,
      openTime,
      closeTime,
      isOpen,
      address,
      phone,
      tableCount,
      costForTwo,
      description,
    } = req.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (tagline !== undefined) {
      updateData.tagline = tagline;
    }

    // Convert cuisine string into array
    if (cuisine !== undefined) {
      if (Array.isArray(cuisine)) {
        updateData.cuisine = cuisine;
      } else if (
        typeof cuisine === "string" &&
        cuisine.trim()
      ) {
        updateData.cuisine = [cuisine.trim()];
      }
    }

    if (rating !== undefined) {
      updateData.rating = rating;
    }

    if (ratingCount !== undefined) {
      updateData.ratingCount = ratingCount;
    }

    if (openTime !== undefined) {
      updateData.openTime = openTime;
    }

    if (closeTime !== undefined) {
      updateData.closeTime = closeTime;
    }

    if (isOpen !== undefined) {
      updateData.isOpen = isOpen;
    }

    if (address !== undefined) {
      updateData.address = address;
    }

    if (phone !== undefined) {
      updateData.phone = phone;
    }

    if (tableCount !== undefined) {
      updateData.tableCount = tableCount;
    }

    if (costForTwo !== undefined) {
      updateData.costForTwo = costForTwo;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    const restaurant = await prisma.restaurant.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Admin update restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// =========================
// Delete Restaurant
// =========================
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.restaurant.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    await prisma.restaurant.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};