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
connectDB();

/* ================= MIDDLEWARE ================= */
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= HEALTH CHECK ================= */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* ================= ROUTES ================= */
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
  res.status(500).json({ message: "Internal Server Error" });
});

/* ================= SERVER ================= */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
