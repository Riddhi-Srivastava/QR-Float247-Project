require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Get all coupons
const getAllCoupons = async () => {
  return await prisma.coupon.findMany({
    orderBy: {
      expiry: "asc",
    },
  });
};

// Get single coupon
const getCouponById = async (id) => {
  return await prisma.coupon.findUnique({
    where: { id },
  });
};

// Create coupon
const createCoupon = async (data) => {
  return await prisma.coupon.create({
    data,
  });
};

// Update coupon
const updateCoupon = async (id, data) => {
  return await prisma.coupon.update({
    where: { id },
    data,
  });
};

// Delete coupon
const deleteCoupon = async (id) => {
  return await prisma.coupon.delete({
    where: { id },
  });
};

// Activate / deactivate coupon
const updateCouponStatus = async (id, active) => {
  return await prisma.coupon.update({
    where: { id },
    data: {
      active,
    },
  });
};

module.exports = {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
};