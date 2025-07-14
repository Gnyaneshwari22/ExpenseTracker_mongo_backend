const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const {
  addExpense,
  getExpenses,
  deleteExpense,
} = require("../controllers/expenseController");
const { downloadExpenses } = require("../controllers/downloadController");

router.post("/", authenticate, addExpense);
router.get("/", authenticate, getExpenses);
router.delete("/:id", authenticate, deleteExpense);
router.get("/download", authenticate, downloadExpenses);

module.exports = router;
