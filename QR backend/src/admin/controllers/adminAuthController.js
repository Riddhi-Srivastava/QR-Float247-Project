const { loginAdmin } = require("../services/adminAuthService");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await loginAdmin({ email, password });

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      ...result,
    });
  } catch (error) {
    console.error("Admin login error:", error);

    if (
      error.message === "Invalid email or password" ||
      error.message === "Admin access required"
    ) {
      return res.status(401).json({
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
  login,
};