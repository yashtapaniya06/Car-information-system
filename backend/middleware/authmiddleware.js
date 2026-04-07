const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

// ================= VERIFY TOKEN =================
exports.verifyToken = (req, res, next) => {
  if (!SECRET_KEY) {
    console.error("JWT_SECRET is not defined in environment variables.");
    return res.status(500).json({
      success: false,
      error: "Server configuration error"
    });
  }

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        error: "Authorization token missing or malformed"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = decoded;

    next();

  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        error: "Token expired"
      });
    }

    return res.status(401).json({
      success: false,
      error: "Invalid token"
    });
  }
};


// ================= VERIFY ADMIN =================
exports.verifyAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized access"
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Admin access required"
      });
    }

    next();

  } catch (err) {
    console.error("VerifyAdmin Error:", err);
    return res.status(500).json({
      success: false,
      error: "Server error"
    });
  }
};