const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getTotalExpensesByUser,
  checkPremiumStatus,
} = require("../controllers/leaderboardController");

router.get("/showleaderboard", auth, getTotalExpensesByUser);
router.get("/user/premiumStatus", auth, checkPremiumStatus);

module.exports = router;
