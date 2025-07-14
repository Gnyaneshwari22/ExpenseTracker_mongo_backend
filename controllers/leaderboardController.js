const Expense = require("../models/Expense");
const User = require("../models/User");

// GET /api/premium/showleaderboard
exports.getTotalExpensesByUser = async (req, res) => {
  try {
    const aggregated = await Expense.aggregate([
      {
        $group: {
          _id: "$userId",
          totalExpense: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          _id: 0,
          username: "$userDetails.name",
          totalExpense: 1,
        },
      },
      { $sort: { totalExpense: -1 } },
    ]);

    const leaderboard = aggregated.map((entry, index) => ({
      rank: index + 1,
      username: entry.username,
      totalExpense: entry.totalExpense,
    }));

    res.status(200).json(leaderboard);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

// GET /api/premium/user/premiumStatus
exports.checkPremiumStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ isPremium: user.isPremiumUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to check premium status", error: err.message });
  }
};
