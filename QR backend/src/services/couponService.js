const crypto = require("crypto");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Create Coupon
const createCoupon = async ({
  code,
  description,
  type,
  value,
  minOrderValue,
  expiry,
  maxUsage,
}) => {
  const existingCoupon = await prisma.coupon.findUnique({
    where: { code },
  });

  if (existingCoupon) {
    throw new Error("Coupon already exists");
  }

  return prisma.coupon.create({
    data: {
      id: crypto.randomUUID(),
      code,
      description,
      type,
      value,
      minOrderValue,
      expiry: new Date(expiry),
      maxUsage,
    },
  });
};

// Get All Coupons
const getCoupons = async () => {
  return prisma.coupon.findMany({
    orderBy: {
      expiry: "asc",
    },
  });
};

// Validate Coupon
const validateCoupon = async (code, orderValue) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code },
  });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  if (!coupon.active) {
    throw new Error("Coupon is inactive");
  }

  if (new Date() > coupon.expiry) {
    throw new Error("Coupon has expired");
  }

  if (coupon.usageCount >= coupon.maxUsage) {
    throw new Error("Coupon usage limit reached");
  }

  if (Number(orderValue) < Number(coupon.minOrderValue)) {
    throw new Error(
      `Minimum order value is ${coupon.minOrderValue}`
    );
  }

  let discount = 0;

  if (coupon.type === "PERCENTAGE") {
    discount = (Number(orderValue) * Number(coupon.value)) / 100;
  } else {
    discount = Number(coupon.value);
  }

  if (discount > Number(orderValue)) {
    discount = Number(orderValue);
  }

  return {
    coupon,
    discount,
    finalAmount: Number(orderValue) - discount,
  };
};

module.exports = {
  createCoupon,
  getCoupons,
  validateCoupon,
};