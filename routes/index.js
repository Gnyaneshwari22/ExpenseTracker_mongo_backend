// routes/index.js
const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const expenseRoutes = require("./expenseRoutes");
const orderRoutes = require("./paymentRoutes");
const passwordRoutes = require("./passwordRoutes");
const premiumRoutes = require("./premiumRoutes");

router.use("/auth", authRoutes);
router.use("/expenses", expenseRoutes);
router.use("/orders", orderRoutes);
router.use("/password", passwordRoutes);
router.use("/premium", premiumRoutes);

module.exports = router;
