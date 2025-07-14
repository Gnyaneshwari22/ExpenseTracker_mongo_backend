const express = require("express");
const router = express.Router();
const {
  forgotPassword,
  validateResetRequest,
  updatePassword,
} = require("../controllers/passwordController");

router.post("/forgot", forgotPassword);
router.get("/validate/:requestId", validateResetRequest);
router.post("/update", updatePassword);

module.exports = router;
