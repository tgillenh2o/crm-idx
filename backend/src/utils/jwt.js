const jwt = require("jsonwebtoken");

exports.signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, teamId: user.teamId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

exports.verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
