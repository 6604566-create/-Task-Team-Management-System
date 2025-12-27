import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/users.js";

const router = express.Router();

/* ================= REGISTER ================= */
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Registration failed",
    });
  }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET_KEY) {
      throw new Error("JWT_SECRET_KEY not defined");
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    /* ✅ COOKIE AUTH (NETLIFY ↔ RENDER SAFE) */
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,          // REQUIRED in production
      sameSite: "none",      // REQUIRED for cross-site
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: "Login failed",
    });
  }
});

/* ================= LOGOUT ================= */
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
});

/* ================= AUTH CHECK ================= */
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
});

export default router;
