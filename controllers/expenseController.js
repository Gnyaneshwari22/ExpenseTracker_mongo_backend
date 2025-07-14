const Expense = require("../models/Expense");

exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;

  try {
    const expense = await Expense.create({
      amount,
      description,
      category,
      userId: req.user.id,
    });

    res
      .status(201)
      .json({ message: "Expense Added Sucessfully", expense: expense });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add expense", error: err.message });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(expenses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch expenses", error: err.message });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!expense)
      return res
        .status(404)
        .json({ message: "Expense not found or unauthorized" });

    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete", error: err.message });
  }
};
