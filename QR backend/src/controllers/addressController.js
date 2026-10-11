const {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../services/addressService");

// Create Address
const create = async (req, res) => {
  try {
    const userId = req.user.userId;

    const address = await createAddress(userId, req.body);

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      address,
    });
  } catch (error) {
    console.error("Create address error:", error);

    if (error.message === "Required address fields are missing") {
      return res.status(400).json({
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

// Get All Addresses
const getAll = async (req, res) => {
  try {
    const userId = req.user.userId;

    const addresses = await getAddresses(userId);

    return res.status(200).json({
      success: true,
      count: addresses.length,
      addresses,
    });
  } catch (error) {
    console.error("Get addresses error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get Single Address
const getOne = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const address = await getAddress(userId, id);

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("Get address error:", error);

    if (error.message === "Address not found") {
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

// Update Address
const update = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const address = await updateAddress(
      userId,
      id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.error("Update address error:", error);

    if (error.message === "Address not found") {
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

// Delete Address
const remove = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await deleteAddress(userId, id);

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Delete address error:", error);

    if (error.message === "Address not found") {
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

// Set Default Address
const setDefault = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const address = await setDefaultAddress(userId, id);

    return res.status(200).json({
      success: true,
      message: "Default address updated successfully",
      address,
    });
  } catch (error) {
    console.error("Set default address error:", error);

    if (error.message === "Address not found") {
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
  create,
  getAll,
  getOne,
  update,
  remove,
  setDefault,
};