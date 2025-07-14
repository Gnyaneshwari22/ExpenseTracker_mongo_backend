const nodemailer = require("nodemailer");

const sendResetEmail = async (toEmail, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS, // App Password, not your Gmail password
    },
  });

  const mailOptions = {
    from: `"Expense Tracker" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: "Password Reset Link",
    html: `<p>Click to reset your password: <a href="${resetLink}">Reset Password</a></p>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
