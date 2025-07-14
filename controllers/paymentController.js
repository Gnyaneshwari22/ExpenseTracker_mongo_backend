const axios = require("axios");
require("dotenv").config();

// 1. Create dedicated Axios instance for Cashfree
const cashfreeAxios = axios.create({
  baseURL:
    process.env.CASHFREE_ENV === "PRODUCTION"
      ? "https://api.cashfree.com"
      : "https://sandbox.cashfree.com",
  headers: {
    "Content-Type": "application/json",
    "x-client-id": process.env.CASHFREE_API_ID,
    "x-client-secret": process.env.CASHFREE_API_SECRET,
    "x-api-version": "2022-09-01", // Critical: Must match your working version
  },
});

// 2. Replace the createOrder function
exports.createOrder = async (orderData) => {
  try {
    // Generate order ID first
    const order_id = `order_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 5)}`;

    const request = {
      order_amount: Number(orderData.orderAmount) * 100,
      order_currency: "INR",
      order_id: order_id,
      customer_details: {
        customer_id: orderData.customerID,
        customer_phone: orderData.customerPhone,
        customer_email: orderData.customerEmail || "no-email@example.com",
      },
      order_meta: {
        return_url: `http://localhost:3001/payment-status?order_id=${order_id}`,
        notify_url: `https://eb7c2a217442.ngrok-free.app/api/orders/cashfree-webhook`,
        payment_methods: "cc,dc,upi,nb",
      },
      order_expiry_time: new Date(Date.now() + 3600000).toISOString(),
    };

    console.log("Sending to Cashfree:", JSON.stringify(request, null, 2));

    // Make API call and log full response
    const response = await cashfreeAxios.post("/pg/orders", request);

    console.log("Cashfree RAW Response:", {
      status: response.status,
      headers: response.headers,
      data: response.data,
    });

    // Destructure the response
    const {
      payment_session_id,
      order_id: cashfreeOrderId,
      cf_order_id,
      order_status,
    } = response.data;

    console.log("Destructured Response:", {
      payment_session_id,
      cashfreeOrderId,
      cf_order_id,
      order_status,
    });

    if (!payment_session_id || !cashfreeOrderId) {
      throw new Error("Missing required fields in Cashfree response");
    }

    return {
      payment_session_id,
      order_id: cashfreeOrderId,
    };
  } catch (error) {
    console.error("Cashfree API Error Details:", {
      config: error.config,
      response: error.response?.data,
      stack: error.stack,
    });
    throw error;
  }
};

// 3. Update getPaymentStatus to use the same Axios instance
exports.getPaymentStatus = async (orderId) => {
  try {
    const response = await cashfreeAxios.get(`/pg/orders/${orderId}/payments`);
    return response.data[0]?.payment_status || "PENDING";
  } catch (error) {
    console.error("Payment status check failed:", error.response?.data);
    throw error;
  }
};
