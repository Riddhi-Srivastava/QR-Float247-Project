const {
  createFood,
  getFoods,
  getFoodById,
  updateFood,
  deleteFood,
} = require("../services/foodService");

// CREATE FOOD
const create = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      veg,
      image,
      prepTime,
      available,
      popular,
      featured,
      restaurantId,
      categoryId,
    } = req.body;

    if (
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
      name,
      description,
      price,
      veg,
      image,
      prepTime,
      available,
      popular,
      featured,
      restaurantId,
      categoryId,
    });

    return res.status(201).json({
      success: true,
      message: "Food item created successfully",
      food,
    });
  } catch (error) {
    console.error("Create food error:", error);

    if (
      error.message === "Restaurant not found" ||
      error.message === "Category not found"
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

// GET ALL FOODS + FILTERS
const getAll = async (req, res) => {
  try {
    const {
      restaurantId,
      categoryId,
      veg,
      available,
    } = req.query;

    if (veg && !["VEG", "NON_VEG"].includes(veg)) {
      return res.status(400).json({
        success: false,
        message: "veg must be VEG or NON_VEG",
      });
    }

    const foods = await getFoods({
      restaurantId,
      categoryId,
      veg,
      available,
    });

    return res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    console.error("Get foods error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET FOOD BY ID
const getOne = async (req, res) => {
  try {
    const food = await getFoodById(req.params.id);

    return res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    console.error("Get food error:", error);

    if (error.message === "Food item not found") {
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

// UPDATE FOOD
const update = async (req, res) => {
  try {
    const food = await updateFood(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Food item updated successfully",
      food,
    });
  } catch (error) {
    console.error("Update food error:", error);

    if (error.message === "Food item not found") {
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

// DELETE FOOD
const remove = async (req, res) => {
  try {
    await deleteFood(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Food item deleted successfully",
    });
  } catch (error) {
    console.error("Delete food error:", error);

    if (error.message === "Food item not found") {
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
  create,
  getAll,
  getOne,
  update,
  remove,
};  