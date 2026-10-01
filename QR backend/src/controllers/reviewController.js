const {
  createReview,
  getRestaurantReviews,
  getReview,
  deleteReview,
} = require("../services/reviewService");

// Create Review
const create = async (req, res) => {
  try {
    const userId = req.user.userId;

    const review = await createReview(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);

    if (
      error.message === "Required review fields are missing" ||
      error.message === "Rating must be between 1 and 5"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Restaurant not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Restaurant Reviews
const getAll = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const reviews = await getRestaurantReviews(restaurantId);

    return res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("Get reviews error:", error);

    if (error.message === "Restaurant not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Single Review
const getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await getReview(id);

    return res.status(200).json({
      success: true,
      review,
    });
  } catch (error) {
    console.error("Get review error:", error);

    if (error.message === "Review not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete Review
const remove = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await deleteReview(userId, id);

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error("Delete review error:", error);

    if (
      error.message === "Review not found" ||
      error.message === "You can only delete your own review"
    ) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  getOne,
  remove,
};