const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  updateRestaurant,
  deleteRestaurant,
} = require("../services/restaurantService");

// Create
const create = async (req, res) => {
  try {
    const {
      name,
      tagline,
      cuisine,
      image,
      logo,
      openTime,
      closeTime,
      isOpen,
      address,
      phone,
      tableCount,
      costForTwo,
      description,
    } = req.body;

    if (
      !name ||
      !tagline ||
      !cuisine ||
      !image ||
      !logo ||
      !openTime ||
      !closeTime ||
      !address ||
      !phone ||
      tableCount === undefined ||
      costForTwo === undefined ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message: "All required restaurant fields are required",
      });
    }

    const restaurant = await createRestaurant({
      name,
      tagline,
      cuisine,
      image,
      logo,
      openTime,
      closeTime,
      isOpen,
      address,
      phone,
      tableCount,
      costForTwo,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Create restaurant error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get All
const getAll = async (req, res) => {
  try {
    const restaurants = await getRestaurants();

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    console.error("Get restaurants error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get One
const getOne = async (req, res) => {
  try {
    const restaurant = await getRestaurantById(req.params.id);

    return res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error) {
    console.error("Get restaurant error:", error);

    if (error.message === "Restaurant not found") {
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

// Update
const update = async (req, res) => {
  try {
    const restaurant = await updateRestaurant(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Update restaurant error:", error);

    if (error.message === "Restaurant not found") {
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

// Delete
const remove = async (req, res) => {
  try {
    await deleteRestaurant(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    console.error("Delete restaurant error:", error);

    if (error.message === "Restaurant not found") {
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