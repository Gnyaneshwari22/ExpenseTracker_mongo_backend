const AWS = require("aws-sdk");

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_SECRET_ACCESS_KEY,
//   secretAccessKey: process.env.AWS_ACCESS_KEY_ID,
//   region: process.env.AWS_REGION,
// });

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, // ✅ Correct
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // ✅ Correct
  region: process.env.AWS_REGION,
});

module.exports = s3;
