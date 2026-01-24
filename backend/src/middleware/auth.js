const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // return empty user instead of crashing
    req.user = null;
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // fallback defaults
    req.user = {
      id: decoded.id || null,
      email: decoded.email || null,
      role: decoded.role || "teamMember"
    };

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    req.user = null; // fallback
    return res.status(401).json({ message: "Invalid token" });
  }
};
