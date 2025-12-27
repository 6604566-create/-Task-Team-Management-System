import express from "express";
import Attendance from "../models/attendances.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* ================= HELPERS ================= */

// Convert "10:30 AM" → "10:30"
function convertTo24Hour(time12h) {
  if (!time12h) return null;

  const [time, period] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

// Calculate working hours
function calculateDuration(timeIn, timeOut) {
  const start = new Date(`1970-01-01T${convertTo24Hour(timeIn)}:00`);
  const end = new Date(`1970-01-01T${convertTo24Hour(timeOut)}:00`);

  let diff = end - start;
  if (diff < 0) diff += 24 * 60 * 60 * 1000; // midnight safety

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `${hours}h ${minutes}m`;
}

/* ================= GET ATTENDANCE ================= */
/* 🔒 Protected */
router.get("/attendance", authMiddleware, async (req, res) => {
  try {
    const attendances = await Attendance.find()
      .populate("employee", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json(attendances);
  } catch (error) {
    console.error("Fetch attendance error:", error);
    return res.status(500).json({ message: "Failed to fetch attendance" });
  }
});

/* ================= POST ATTENDANCE ================= */
/* 🔒 Protected */
router.post("/attendance", authMiddleware, async (req, res) => {
  try {
    const { employeeId, timeIn, timeOut } = req.body;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee is required" });
    }

    if (timeIn && timeOut) {
      return res.status(400).json({
        message: "Send either Time In or Time Out, not both",
      });
    }

    // ✅ Use real Date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let attendance = await Attendance.findOne({
      employee: employeeId,
      day: today,
    });

    /* ===== TIME IN ===== */
    if (timeIn) {
      if (attendance) {
        return res
          .status(400)
          .json({ message: "Time In already marked for today" });
      }

      await Attendance.create({
        employee: employeeId,
        day: today,
        timeIn,
      });

      return res.status(201).json({
        message: "Time In marked successfully",
      });
    }

    /* ===== TIME OUT ===== */
    if (timeOut) {
      if (!attendance || !attendance.timeIn) {
        return res
          .status(400)
          .json({ message: "Time In not found for today" });
      }

      if (attendance.timeOut) {
        return res
          .status(400)
          .json({ message: "Time Out already marked" });
      }

      attendance.timeOut = timeOut;
      attendance.workingHours = calculateDuration(
        attendance.timeIn,
        timeOut
      );

      await attendance.save();

      return res.status(200).json({
        message: "Time Out marked successfully",
      });
    }

    return res.status(400).json({
      message: "Invalid attendance request",
    });
  } catch (error) {
    console.error("Attendance error:", error);
    return res.status(500).json({ message: "Attendance failed" });
  }
});

export default router;
