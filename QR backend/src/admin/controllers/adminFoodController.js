const {
  getAllFood,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
  updateAvailability,
} = require("../services/adminFoodService");

// Get all food items
const getAll = async (req, res) => {
  try {
    const foodItems = await getAllFood();

    return res.status(200).json({
      success: true,
      count: foodItems.length,
      foodItems,
    });
  } catch (error) {
    console.error("Admin get food error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get single food item
const getOne = async (req, res) => {
  try {
    const { id } = req.params;

    const food = await getFoodById(id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    return res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    console.error("Admin get food by id error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Create food item
const create = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      price,
      veg,
      image,
      prepTime,
      restaurantId,
      categoryId,
      available,
      popular,
      featured,
    } = req.body;

    if (
      !id ||
      !name ||
      !description ||
      price === undefined ||
      !veg ||
      !image ||
      prepTime === undefined ||
      !restaurantId ||
      !categoryId
    ) {
      return res.status(400).json({
        success: false,
        message: "Required food fields are missing",
      });
    }

    if (!["VEG", "NON_VEG"].includes(veg)) {
      return res.status(400).json({
        success: false,
        message: "veg must be VEG or NON_VEG",
      });
    }

    const food = await createFood({
      id,
      name,
      description,
      price,
      veg,
      image,
      prepTime,
      restaurantId,
      categoryId,
      available,
      popular,
      featured,
    });

    return res.status(201).json({
      success: true,
      message: "Food item created successfully",
      food,
    });
  } catch (error) {
    console.error("Admin create food error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update food item
const update = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await getFoodById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    const food = await updateFood(id, req.body);

    return res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      food,
    });
  } catch (error) {
    console.error("Admin update food error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete food item
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await getFoodById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    await deleteFood(id);

    return res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete food error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update availability
const availability = async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    if (typeof available !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "available must be true or false",
      });
    }

    const existing = await getFoodById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Food item not found",
      });
    }

    const food = await updateAvailability(id, available);

    return res.status(200).json({
      success: true,
      message: "Food availability updated successfully",
      food,
    });
  } catch (error) {
    console.error("Admin food availability error:", error);

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
  availability,
};