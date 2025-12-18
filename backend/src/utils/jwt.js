// src/utils/jwt.js
const jwt = require("jsonwebtoken");

exports.signToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
