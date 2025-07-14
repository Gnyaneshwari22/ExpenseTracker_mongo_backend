// const mongoose = require("mongoose");
// const { Schema } = mongoose;

// const orderSchema = new Schema(
//   {
//     orderId: {
//       type: String,
//       required: true,
//     },
//     paymentId: {
//       type: String,
//     },
//     status: {
//       type: String,
//       enum: ["PENDING", "SUCCESSFUL", "FAILED"],
//       default: "PENDING",
//     },
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Order", orderSchema);
const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true, // Added unique constraint
    },
    paymentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["PENDING", "SUCCESSFUL", "FAILED", "PROCESSING"], // Added PROCESSING
      default: "PENDING",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderAmount: {
      // Added for payment tracking
      type: Number,
      required: true,
    },
    paymentSessionId: {
      // Needed for Cashfree integration
      type: String,
      required: true,
    },
    customerDetails: {
      // Added for payment processing
      customerId: String,
      customerPhone: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);

// return_url: `http://localhost:3000/payment-status?order_id=${orderData.orderId}`,
// notify_url: `https://cbe897b62dde.ngrok-free.app/api/orders/cashfree-webhook`,
