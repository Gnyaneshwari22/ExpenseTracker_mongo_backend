const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  // console.log("Token from header:", token);

  if (!token)
    return res
      .status(401)
      .json({ message: "Access Denied. No token provided." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded token:===============>", decoded);
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;
