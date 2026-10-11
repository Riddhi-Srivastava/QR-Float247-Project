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

// Create Review
const createReview = async (userId, data) => {
  const {
    restaurantId,
    rating,
    title,
    comment,
    customerName,
  } = data;

  if (!restaurantId || !rating || !title || !comment || !customerName) {
    throw new Error("Required review fields are missing");
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  const review = await prisma.review.create({
    data: {
      id: crypto.randomUUID(),
      restaurantId,
      userId,
      customerName,
      rating: Number(rating),
      title,
      comment,
    },
  });

  // Update restaurant rating
  const ratingData = await prisma.review.aggregate({
    where: {
      restaurantId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  await prisma.restaurant.update({
    where: {
      id: restaurantId,
    },
    data: {
      rating: ratingData._avg.rating || 0,
      ratingCount: ratingData._count.rating || 0,
    },
  });

  return review;
};

// Get Restaurant Reviews
const getRestaurantReviews = async (restaurantId) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id: restaurantId,
    },
  });

  if (!restaurant) {
    throw new Error("Restaurant not found");
  }

  return prisma.review.findMany({
    where: {
      restaurantId,
    },
    orderBy: {
      date: "desc",
    },
  });
};

// Get Single Review
const getReview = async (reviewId) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return review;
};

// Delete Review
const deleteReview = async (userId, reviewId) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.userId !== userId) {
    throw new Error("You can only delete your own review");
  }

  await prisma.review.delete({
    where: {
      id: reviewId,
    },
  });

  // Recalculate restaurant rating
  const ratingData = await prisma.review.aggregate({
    where: {
      restaurantId: review.restaurantId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  await prisma.restaurant.update({
    where: {
      id: review.restaurantId,
    },
    data: {
      rating: ratingData._avg.rating || 0,
      ratingCount: ratingData._count.rating || 0,
    },
  });

  return review;
};

module.exports = {
  createReview,
  getRestaurantReviews,
  getReview,
  deleteReview,
};