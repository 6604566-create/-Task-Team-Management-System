import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // ✅ READ TOKEN FROM COOKIE
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: No token provided",
      });
    }

    if (!process.env.JWT_SECRET_KEY) {
      console.error("JWT_SECRET_KEY not defined");
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    // ✅ VERIFY TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // attach user id (keep it consistent)
    req.user = decoded.userId;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token",
    });
  }
};

export default authMiddleware;
