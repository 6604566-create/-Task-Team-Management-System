import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

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
await connectDB();

/* ================= MIDDLEWARE ================= */

// ✅ MUST use cookie-parser
app.use(cookieParser());

// ✅ EXACT frontend origin (NO *)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://task-team-management-system-85dk.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // ⭐ REQUIRED FOR COOKIES
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight
app.options("*", cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= ROUTES ================= */
app.use("/api/auth", authRoute);
app.use("/api", dashboardRoute);
app.use("/api", employeeRoute);
app.use("/api", projectRoute);
app.use("/api", taskRoute);
app.use("/api", timesheetRoute);
app.use("/api", attendanceRoute);

/* ================= SERVER ================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
