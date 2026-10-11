const {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
} = require("../services/notificationService");

// Create
const create = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notification = await createNotification(
      userId,
      req.body
    );

    res.status(201).json({
      success: true,
      message: "Notification created successfully",
      notification,
    });
  } catch (error) {
    console.error("Create notification error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get
const getAll = async (req, res) => {
  try {
    const userId = req.user.userId;

    const notifications = await getNotifications(userId);

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Mark Read
const markRead = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const notification = await markAsRead(
      userId,
      id
    );

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Mark notification error:", error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete
const remove = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    await deleteNotification(userId, id);

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete notification error:", error);

    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  markRead,
  remove,
};