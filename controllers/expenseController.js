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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;

  try {
    const [expenses, totalCount] = await Promise.all([
      Expense.find({ userId: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Expense.countDocuments({ userId: req.user.id }),
    ]);

    res.status(200).json({ expenses, totalCount });
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
