// const { CashfreePG } = require("cashfree-pg");

// const cf = new CashfreePG({
//   env: "SANDBOX",
//   clientId: process.env.CASHFREE_API_ID,
//   clientSecret: process.env.CASHFREE_API_SECRET,
// });

// module.exports = cf;

// utils/cashfreeClient.js
const { Cashfree } = require("cashfree-pg");

// Initialize with v5 syntax
const cf = new Cashfree(
  Cashfree.SANDBOX, // Environment: SANDBOX or PRODUCTION
  process.env.CASHFREE_API_ID,
  process.env.CASHFREE_API_SECRET
);

module.exports = cf;
