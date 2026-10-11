const {
  createCoupon,
  getCoupons,
  validateCoupon,
} = require("../services/couponService");

// Create Coupon
const create = async (req, res) => {
  try {
    const {
      code,
      description,
      type,
      value,
      minOrderValue,
      expiry,
      maxUsage,
    } = req.body;

    if (
      !code ||
      !description ||
      !type ||
      value === undefined ||
      minOrderValue === undefined ||
      !expiry ||
      maxUsage === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Required coupon fields are missing",
      });
    }

    if (!["PERCENTAGE", "FLAT"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "type must be PERCENTAGE or FLAT",
      });
    }

    const coupon = await createCoupon({
      code,
      description,
      type,
      value,
      minOrderValue,
      expiry,
      maxUsage,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Create coupon error:", error);

    if (error.message === "Coupon already exists") {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get All Coupons
const getAll = async (req, res) => {
  try {
    const coupons = await getCoupons();

    return res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error("Get coupons error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Validate Coupon
const validate = async (req, res) => {
  try {
    const { code, orderValue } = req.body;

    if (!code || orderValue === undefined) {
      return res.status(400).json({
        success: false,
        message: "code and orderValue are required",
      });
    }

    const result = await validateCoupon(code, orderValue);

    return res.status(200).json({
      success: true,
      message: "Coupon is valid",
      ...result,
    });
  } catch (error) {
    console.error("Validate coupon error:", error);

    const validationErrors = [
      "Coupon not found",
      "Coupon is inactive",
      "Coupon has expired",
      "Coupon usage limit reached",
    ];

    if (
      validationErrors.includes(error.message) ||
      error.message.startsWith("Minimum order value")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  create,
  getAll,
  validate,
};