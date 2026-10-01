const { generateTableQR } = require("../services/qrService");

const getTableQR = async (req, res) => {
  try {
    const qr = await generateTableQR(req.params.id);

    return res.status(200).json({
      success: true,
      qr,
    });
  } catch (error) {
    console.error("Generate QR error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getTableQR,
};