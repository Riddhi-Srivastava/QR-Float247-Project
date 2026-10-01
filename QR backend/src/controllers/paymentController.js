const {
  createPayment,
  confirmPayment,
} = require("../services/paymentService");

const create = async (req, res) => {
  try {
    const { orderId, method, amount, transactionId } = req.body;

    if (!orderId || !method || amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Required payment fields are missing",
      });
    }

    if (!["UPI", "CARD", "CASH"].includes(method)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    const payment = await createPayment({
      orderId,
      method,
      amount,
      transactionId,
    });

    return res.status(201).json({
      success: true,
      message: "Payment created successfully",
      payment,
    });
  } catch (error) {
    console.error("Create payment error:", error);

    if (
      error.message === "Order not found" ||
      error.message === "Payment already exists"
    ) {
      return res.status(400).json({
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

const confirm = async (req, res) => {
  try {
    const payment = await confirmPayment(req.params.orderId);

    return res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      payment,
    });
  } catch (error) {
    console.error("Confirm payment error:", error);

    if (error.message === "Payment not found") {
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
  confirm,
};