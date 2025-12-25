import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No Authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided, authorization denied",
      });
    }

    const token = authHeader.split(" ")[1];

    // ❌ JWT secret missing
    if (!process.env.JWT_SECRET_KEY) {
      console.error("JWT_SECRET_KEY not defined");
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // Attach user id to request
    req.user = decoded.userId;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      message: "Token is not valid",
    });
  }
};

export default authMiddleware;

