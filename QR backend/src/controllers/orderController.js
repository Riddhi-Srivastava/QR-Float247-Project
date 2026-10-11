const {
  createOrder,
  getOrdersByGuest,
  getOrderById,
  updateOrderStatus,
} = require("../services/orderService");

const getGuestId = (req) => {
  return req.headers["x-guest-id"];
};

// CREATE ORDER
const create = async (req, res) => {
  try {
    const guestId = getGuestId(req);

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: "Guest ID is required",
      });
    }

    const {
      restaurantId,
      tableNumber,
      customerName,
      customerPhone,
      customerEmail,
      paymentMethod,
      specialInstructions,
    } = req.body;

    if (
      !restaurantId ||
      !tableNumber ||
      !customerName ||
      !customerPhone ||
      !paymentMethod
    ) {
      return res.status(400).json({
        success: false,
        message: "Required order fields are missing",
      });
    }

    if (!["UPI", "CARD", "CASH"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "paymentMethod must be UPI, CARD or CASH",
      });
    }

    const order = await createOrder({
      guestId,
      restaurantId,
      tableNumber,
      customerName,
      customerPhone,
      customerEmail,
      paymentMethod,
      specialInstructions,
    });

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    if (
      error.message === "Cart is empty" ||
      error.message === "Restaurant not found" ||
      error.message === "Cart contains food from another restaurant" ||
      error.message?.includes("is currently unavailable")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

// GET ALL ORDERS FOR GUEST
const getMyOrders = async (req, res) => {
  try {
    const guestId = getGuestId(req);

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: "Guest ID is required",
      });
    }

    const orders = await getOrdersByGuest(guestId);

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

// GET SINGLE ORDER
const getOne = async (req, res) => {
  try {
    const guestId = getGuestId(req);

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: "Guest ID is required",
      });
    }

    const order = await getOrderById(
      req.params.id,
      guestId
    );

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);

    if (error.message === "Order not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

// UPDATE ORDER STATUS
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    const order = await updateOrderStatus(
      req.params.id,
      status
    );

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    if (
      error.message === "Order not found" ||
      error.message === "Invalid order status"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: error?.message || "Internal server error",
    });
  }
};

module.exports = {
  create,
  getMyOrders,
  getOne,
  updateStatus,
};