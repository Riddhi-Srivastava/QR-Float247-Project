const {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
} = require("../services/adminCouponService");

const getAll = async (req, res) => {
  try {
    const coupons = await getAllCoupons();

    return res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    console.error("Admin get coupons error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await getCouponById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error("Admin get coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const create = async (req, res) => {
  try {
    const {
      id,
      code,
      description,
      type,
      value,
      minOrderValue,
      expiry,
      active,
      usageCount,
      maxUsage,
    } = req.body;

    if (
      !id ||
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

    const allowedTypes = ["PERCENTAGE", "FLAT"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon type",
      });
    }

    const coupon = await createCoupon({
      id,
      code,
      description,
      type,
      value,
      minOrderValue,
      expiry: new Date(expiry),
      active: active ?? true,
      usageCount: usageCount ?? 0,
      maxUsage,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.error("Admin create coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await getCouponById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const data = { ...req.body };

    if (data.expiry) {
      data.expiry = new Date(data.expiry);
    }

    const coupon = await updateCoupon(id, data);

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Admin update coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await getCouponById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await deleteCoupon(id);

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete coupon error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    if (typeof active !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "active must be true or false",
      });
    }

    const existing = await getCouponById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const coupon = await updateCouponStatus(id, active);

    return res.status(200).json({
      success: true,
      message: "Coupon status updated successfully",
      coupon,
    });
  } catch (error) {
    console.error("Admin coupon status error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAll,
  getOne,
  create,
  update,
  remove,
  updateStatus,
};