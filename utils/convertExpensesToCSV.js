module.exports = function convertExpensesToCSV(expenses) {
  const header = "Amount,Category,Description,Created At\n";
  const rows = expenses
    .map((e) => `${e.amount},${e.category},${e.description},${e.createdAt}`)
    .join("\n");
  return header + rows;
};
