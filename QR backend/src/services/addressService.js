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

// Create Address
const createAddress = async (userId, data) => {
  const { label, line1, line2, city, pincode, isDefault } = data;

  if (!label || !line1 || !city || !pincode) {
    throw new Error("Required address fields are missing");
  }

  if (isDefault) {
    await prisma.address.updateMany({
      where: {
        userId,
      },
      data: {
        isDefault: false,
      },
    });
  }

  return prisma.address.create({
    data: {
      id: crypto.randomUUID(),
      userId,
      label,
      line1,
      line2,
      city,
      pincode,
      isDefault: isDefault || false,
    },
  });
};

// Get User Addresses
const getAddresses = async (userId) => {
  return prisma.address.findMany({
    where: {
      userId,
    },
    orderBy: [
      {
        isDefault: "desc",
      },
    ],
  });
};

// Get One Address
const getAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  return address;
};

// Update Address
const updateAddress = async (userId, addressId, data) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  if (data.isDefault) {
    await prisma.address.updateMany({
      where: {
        userId,
      },
      data: {
        isDefault: false,
      },
    });
  }

  return prisma.address.update({
    where: {
      id: addressId,
    },
    data: {
      label: data.label,
      line1: data.line1,
      line2: data.line2,
      city: data.city,
      pincode: data.pincode,
      isDefault: data.isDefault,
    },
  });
};

// Delete Address
const deleteAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  await prisma.address.delete({
    where: {
      id: addressId,
    },
  });

  return address;
};

// Set Default Address
const setDefaultAddress = async (userId, addressId) => {
  const address = await prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });

  if (!address) {
    throw new Error("Address not found");
  }

  await prisma.address.updateMany({
    where: {
      userId,
    },
    data: {
      isDefault: false,
    },
  });

  return prisma.address.update({
    where: {
      id: addressId,
    },
    data: {
      isDefault: true,
    },
  });
};

module.exports = {
  createAddress,
  getAddresses,
  getAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};