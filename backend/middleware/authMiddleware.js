const jwt = require("jsonwebtoken");
const User = require("../models/User");

const resolveUserRole = (user) => {
  if (!user) return "customer";
  if (user.name === "admin") return "admin";
  if (process.env.ADMIN_EMAIL && user.email === process.env.ADMIN_EMAIL) {
    return "admin";
  }
  return user.role || "customer";
};

const protect = async (req, res, next) => {

  let token;

  if (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")) {

    try {

      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      req.userRole = resolveUserRole(req.user);

      next();

    } catch (error) {
      res.status(401).json({ message: "Not authorized" });
    }

  } else {
    res.status(401).json({ message: "No token provided" });
  }

};

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (req.userRole !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
};

module.exports = { protect, adminOnly, resolveUserRole };
