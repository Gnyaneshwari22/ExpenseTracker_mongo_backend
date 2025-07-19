const { Cashfree } = require("cashfree-pg");

// Initialize with v5 syntax
const cf = new Cashfree(
  Cashfree.SANDBOX, // Environment: SANDBOX or PRODUCTION
  process.env.CASHFREE_API_ID,
  process.env.CASHFREE_API_SECRET
);

module.exports = cf;
