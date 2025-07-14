const AWS = require("aws-sdk");
const Expense = require("../models/Expense");
const convertExpensesToCSV = require("../utils/convertExpensesToCSV");
const s3 = require("../utils/s3Client");

exports.downloadExpenses = async (req, res) => {
  try {
    const userId = req.user.id;

    const expenses = await Expense.find({ userId }).lean();
    if (!expenses || expenses.length === 0) {
      return res.status(404).json({ message: "No expenses found" });
    }

    const csv = convertExpensesToCSV(expenses);
    const fileName = `expenses_${userId}_${Date.now()}.csv`;

    const uploadParams = {
      Bucket: process.env.S3_BUCKET,
      Key: fileName,
      Body: csv,
      ContentType: "text/csv",
    };

    const data = await s3.upload(uploadParams).promise();

    res.status(200).json({
      message: "Download ready",
      fileUrl: data.Location,
    });
  } catch (err) {
    console.error("Download error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
