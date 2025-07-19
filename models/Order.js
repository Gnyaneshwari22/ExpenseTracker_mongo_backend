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
