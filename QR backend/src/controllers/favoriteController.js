const {
  addFavorite,
  getFavorites,
  removeFavorite,
} = require("../services/favoriteService");

// Add Favorite
const add = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { foodId } = req.body;

    if (!foodId) {
      return res.status(400).json({
        success: false,
        message: "foodId is required",
      });
    }

    const favorite = await addFavorite(userId, foodId);

    return res.status(201).json({
      success: true,
      message: "Food added to favorites",
      favorite,
    });
  } catch (error) {
    console.error("Add favorite error:", error);

    if (error.message === "Food item not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    if (error.message === "Food already in favorites") {
      return res.status(409).json({
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

// Get Favorites
const getAll = async (req, res) => {
  try {
    const userId = req.user.userId;

    const favorites = await getFavorites(userId);

    return res.status(200).json({
      success: true,
      count: favorites.length,
      favorites,
    });
  } catch (error) {
    console.error("Get favorites error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Remove Favorite
const remove = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { foodId } = req.params;

    await removeFavorite(userId, foodId);

    return res.status(200).json({
      success: true,
      message: "Food removed from favorites",
    });
  } catch (error) {
    console.error("Remove favorite error:", error);

    if (error.message === "Favorite not found") {
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

module.exports = {
  add,
  getAll,
  remove,
};