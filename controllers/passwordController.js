const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const ForgotPassword = require("../models/ForgotPassword");
const sendResetEmail = require("../utils/sendResetEmail"); // Gmail-based email sender

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const requestId = uuidv4();

    try {
      const record = await ForgotPassword.create({
        userId: user._id,
        requestId,
      });
      console.log("Record created:", record);
    } catch (err) {
      console.error("DB error:", err.message);
      return res.status(500).json({ message: "Failed to create reset token" });
    }

    const resetUrl = `http://localhost:3001/reset-password/${requestId}`;

    try {
      await sendResetEmail(email, resetUrl);
      console.log("✅ Email sent via Gmail");
      return res.status(200).json({ message: "Reset email sent" });
    } catch (err) {
      console.error("❌ Email send error:", err.message);
      return res
        .status(500)
        .json({ message: "Failed to send email", error: err.message });
    }
  } catch (err) {
    res.status(500).json({ message: "Unexpected error", error: err.message });
  }
};

exports.validateResetRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await ForgotPassword.findOne({ requestId, isActive: true });
    if (!request)
      return res.status(400).json({ message: "Invalid or expired link" });

    res.status(200).json({ message: "Valid reset request" });
  } catch (err) {
    res.status(500).json({ message: "Validation failed", error: err.message });
  }
};

exports.updatePassword = async (req, res) => {
  const { requestId, newPassword } = req.body;

  try {
    const request = await ForgotPassword.findOne({ requestId, isActive: true });
    if (!request)
      return res.status(400).json({ message: "Invalid or expired link" });

    const user = await User.findById(request.userId);
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    request.isActive = false;
    await request.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update password", error: err.message });
  }
};
