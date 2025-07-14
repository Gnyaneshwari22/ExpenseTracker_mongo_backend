const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const Order = require("../models/Order");
const User = require("../models/User");
const {
  createOrder,
  getPaymentStatus,
} = require("../controllers/paymentController");
const authenticate = require("../middleware/authMiddleware");

// router.post("/pay", authenticate, async (req, res) => {
//   try {
//     const { amount, customerId, customerPhone, customerEmail } = req.body;

//     // Validate inputs
//     if (!amount || !customerId || !customerPhone) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     // Create order
//     const { payment_session_id, order_id } = await createOrder({
//       orderAmount: amount,
//       customerID: customerId,
//       customerPhone,
//       customerEmail,
//     });

//     // Save to database
//     const order = new Order({
//       orderId: order_id,
//       userId: req.user._id, // From auth middleware
//       amount,
//       status: "PENDING",
//     });
//     await order.save();

//     res.json({
//       success: true,
//       paymentSessionId: payment_session_id,
//       orderId: order_id,
//     });
//   } catch (error) {
//     console.error("Payment Error:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message || "Payment processing failed",
//     });
//   }
// });

// Check payment status

router.post("/pay", authenticate, async (req, res) => {
  try {
    const { amount, customerPhone } = req.body;

    // Process payment
    const cashfreeResponse = await createOrder({
      orderAmount: amount,
      customerID: req.user.id,
      customerPhone,
      customerEmail: req.user.email,
    });

    console.log("Cashfree Processed Response:", cashfreeResponse);

    // Destructure the response
    const { payment_session_id, order_id } = cashfreeResponse;

    // Save to database
    const order = new Order({
      orderId: order_id,
      paymentSessionId: payment_session_id,
      orderAmount: amount,
      userId: new mongoose.Types.ObjectId(req.user.id),
      status: "PENDING",
      customerDetails: {
        customerId: req.user.id,
        customerPhone,
      },
    });

    await order.save();

    res.json({
      success: true,
      paymentSessionId: payment_session_id,
      orderId: order_id,
    });
  } catch (error) {
    console.error("Final Payment Error:", {
      error: error.message,
      stack: error.stack,
      requestBody: req.body,
      user: req.user,
    });

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

router.get("/status/:orderId", async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // 1. Validate orderId format first
    if (!orderId || !orderId.startsWith("order_")) {
      return res.status(400).json({
        success: false,
        error: "Invalid order ID format",
      });
    }

    // 2. Get payment status with proper error handling
    const status = await getPaymentStatus(orderId);

    // 3. Handle case where order doesn't exist
    if (!status) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
      });
    }

    // 4. Successful response
    res.json({
      success: true,
      orderId,
      status: status || "PENDING", // Default status
    });
  } catch (error) {
    console.error(
      `Status check failed for order ${req.params.orderId}:`,
      error
    );

    res.status(500).json({
      success: false,
      error: error.message || "Status check failed",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Cashfree Webhook
router.post("/cashfree-webhook", async (req, res) => {
  try {
    const {
      order: { order_id },
      payment,
    } = req.body.data;
    const paymentStatus = payment.payment_status;

    // Status mapping
    const statusMap = {
      SUCCESS: "SUCCESSFUL",
      FAILED: "FAILED",
      PENDING: "PENDING",
    };

    // Update order
    await Order.findOneAndUpdate(
      { orderId: order_id },
      {
        status: statusMap[paymentStatus] || "PENDING",
        paymentId: payment.payment_id,
      }
    );

    // Upgrade user if payment successful
    if (paymentStatus === "SUCCESS") {
      const order = await Order.findOne({ orderId: order_id });
      if (order) {
        await User.findByIdAndUpdate(order.userId, { isPremiumUser: true });
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
