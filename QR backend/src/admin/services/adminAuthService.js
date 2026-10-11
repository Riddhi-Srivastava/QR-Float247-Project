require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../../config/prisma");

const loginAdmin = async ({ email, password }) => {
  const admin = await prisma.user.findUnique({
    where: { email },
  });

  if (!admin || !admin.password) {
    throw new Error("Invalid email or password");
  }

  if (admin.role !== "ADMIN") {
    throw new Error("Admin access required");
  }

  const passwordMatch = await bcrypt.compare(password, admin.password);

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = jwt.sign(
    {
      userId: admin.id,
      role: admin.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.ADMIN_SESSION_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "8h",
    }
  );

  return {
    token,
    user: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
    },
  };
};

module.exports = {
  loginAdmin,
};