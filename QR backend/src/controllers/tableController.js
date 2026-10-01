const {
  createTable,
  getTables,
  updateTableStatus,
} = require("../services/tableService");

const create = async (req, res) => {
  try {
    const { number, restaurantId } = req.body;

    if (!number || !restaurantId) {
      return res.status(400).json({
        success: false,
        message: "number and restaurantId are required",
      });
    }

    const table = await createTable({
      number,
      restaurantId,
    });

    return res.status(201).json({
      success: true,
      message: "Table created successfully",
      table,
    });
  } catch (error) {
    console.error("Create table error:", error);

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

const getAll = async (req, res) => {
  try {
    const { restaurantId } = req.query;

    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "restaurantId is required",
      });
    }

    const tables = await getTables(restaurantId);

    return res.status(200).json({
      success: true,
      count: tables.length,
      tables,
    });
  } catch (error) {
    console.error("Get tables error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "AVAILABLE",
      "OCCUPIED",
      "ORDERING",
      "PAYMENT_PENDING",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid table status",
      });
    }

    const table = await updateTableStatus(
      req.params.id,
      status
    );

    return res.status(200).json({
      success: true,
      message: "Table status updated successfully",
      table,
    });
  } catch (error) {
    console.error("Update table status error:", error);

    if (error.message === "Table not found") {
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
  updateStatus,
};