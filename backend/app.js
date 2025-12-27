import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // ✅ REQUIRED

import connectDB from "./config/db.js";

// Routes
import authRoute from "./routes/auth.js";
import dashboardRoute from "./routes/dashboard.js";
import employeeRoute from "./routes/employee.js";
import projectRoute from "./routes/project.js";
import taskRoute from "./routes/task.js";
import timesheetRoute from "./routes/timesheet.js";
import attendanceRoute from "./routes/attendance.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

/* ================= DATABASE ================= */
(async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
})();

/* ================= MIDDLEWARE ================= */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL,     // Vercel / Netlify
  process.env.CLIENT_URL_2,   // optional
].filter(Boolean);

// 🔥 REQUIRED FOR COOKIES ON RENDER
app.set("trust proxy", 1);

// 🔥 CORS (COOKIE SAFE)
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // server-to-server / curl

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // 🔥 MUST be true
  })
);

// 🔥 COOKIE PARSER (VERY IMPORTANT)
app.use(cookieParser());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.status(200).send("API is running 🚀");
});

/* ================= ROUTES ================= */
/**
 * FINAL ROUTES
 * POST   /api/auth/register
 * POST   /api/auth/login
 * POST   /api/auth/logout
 *
 * GET    /api/dashboard        (protected)
 * CRUD   /api/employees        (protected)
 * CRUD   /api/projects         (protected)
 * CRUD   /api/tasks            (protected)
 * CRUD   /api/timesheet        (protected)
 * CRUD   /api/attendance       (protected)
 */

app.use("/api/auth", authRoute);
app.use("/api", dashboardRoute);
app.use("/api", employeeRoute);
app.use("/api", projectRoute);
app.use("/api", taskRoute);
app.use("/api", timesheetRoute);
app.use("/api", attendanceRoute);

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);

  res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message,
  });
});

/* ================= SERVER ================= */

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
