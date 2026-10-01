const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../services/cartService");

const getGuestId = (req) => {
  return req.headers["x-guest-id"];
};

const get = async (req, res) => {
  try {
    const guestId = getGuestId(req);

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: "Guest ID is required",
      });
    }

    const cart = await getCart(guestId);

    return res.status(200).json({
      success: true,
      cart: cart || {
        items: [],
      },
    });
  } catch (error) {
    console.error("Get cart error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const add = async (req, res) => {
  try {
    const guestId = getGuestId(req);

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: "Guest ID is required",
      });
    }

    const { foodId, quantity } = req.body;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "foodId is required",
      });
    }

    const item = await addToCart(
      guestId,
      foodId,
      quantity ?? 1
    );

    return res.status(201).json({
      success: true,
      message: "Item added to cart",
      item,
    });
  } catch (error) {
    console.error("Add cart error:", error);

    if (
      error.message === "Food item not found" ||
      error.message === "Food item is not available"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message === "Quantity must be at least 1"
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

const update = async (req, res) => {
  try {
    const guestId = getGuestId(req);

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: "Guest ID is required",
      });
    }

    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "quantity is required",
      });
    }

    const item = await updateCartItem(
      guestId,
      req.params.id,
      quantity
    );

    return res.status(200).json({
      success: true,
      message: "Cart item updated",
      item,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    if (
      error.message === "Cart not found" ||
      error.message === "Cart item not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (
      error.message === "Quantity must be at least 1"
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

const remove = async (req, res) => {
  try {
    const guestId = getGuestId(req);

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: "Guest ID is required",
      });
    }

    await removeCartItem(
      guestId,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Cart item removed",
    });
  } catch (error) {
    console.error("Remove cart error:", error);

    if (
      error.message === "Cart not found" ||
      error.message === "Cart item not found"
    ) {
      return res.status(404).json({
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

const clear = async (req, res) => {
  try {
    const guestId = getGuestId(req);

    if (!guestId) {
      return res.status(400).json({
        success: false,
        message: "Guest ID is required",
      });
    }

    await clearCart(guestId);

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error("Clear cart error:", error);

    if (error.message === "Cart not found") {
      return res.status(404).json({
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
  get,
  add,
  update,
  remove,
  clear,
};