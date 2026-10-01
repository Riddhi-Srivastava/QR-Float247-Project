const {
  createStaff,
  getStaff,
  updateStaffRole,
  deleteStaff,
} = require("../services/staffService");

// Create Staff
const create = async (req, res) => {
  try {
    const staff = await createStaff(req.body);

    res.status(201).json({
      success: true,
      message: "Staff created successfully",
      staff,
    });
  } catch (error) {
    console.error("Create staff error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Staff
const getAll = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const staff = await getStaff(restaurantId);

    res.status(200).json({
      success: true,
      count: staff.length,
      staff,
    });
  } catch (error) {
    console.error("Get staff error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update Role
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    const staff = await updateStaffRole(id, role);

    res.status(200).json({
      success: true,
      message: "Staff role updated successfully",
      staff,
    });
  } catch (error) {
    console.error("Update staff role error:", error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Staff
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteStaff(id);

    res.status(200).json({
      success: true,
      message: "Staff removed successfully",
    });
  } catch (error) {
    console.error("Delete staff error:", error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  updateRole,
  remove,
};