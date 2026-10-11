require("dotenv").config();

const crypto = require("crypto");

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

// Create Notification
const createNotification = async (userId, data) => {
  const { title, message, type } = data;

  if (!title || !message) {
    throw new Error("Title and message are required");
  }

  return prisma.notification.create({
    data: {
      id: crypto.randomUUID(),
      userId,
      title,
      message,
      type: type || "GENERAL",
    },
  });
};

// Get User Notifications
const getNotifications = async (userId) => {
  return prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Mark Notification Read
const markAsRead = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      isRead: true,
    },
  });
};

// Delete Notification
const deleteNotification = async (userId, notificationId) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  await prisma.notification.delete({
    where: {
      id: notificationId,
    },
  });

  return notification;
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
};
