import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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
    process.exit(1); // ❗ stop server if DB fails
  }
})();

/* ================= MIDDLEWARE ================= */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.CLIENT_URL,
  process.env.CLIENT_URL_2,
].filter(Boolean);

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ================= ROUTES ================= */
/**
 * IMPORTANT:
 * Auth routes are mounted at /api/auth
 * Final endpoints:
 * POST /api/auth/register
 * POST /api/auth/login
 */

app.use("/api", authRoute);
app.use("/api", dashboardRoute);
app.use("/api", employeeRoute);
app.use("/api", projectRoute);
app.use("/api", taskRoute);
app.use("/api", timesheetRoute);
app.use("/api", attendanceRoute);

/* ================= ERROR HANDLER ================= */

app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Internal Server Error"
        : err.message || "Internal Server Error",
  });
});

/* ================= SERVER ================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
