const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id || null,
      email: decoded.email || null,
      role: decoded.role || "teamMember",
    };

    next();
  } catch (err) {
    console.error("JWT ERROR:", err.message);
    req.user = null;
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = { verifyToken };
