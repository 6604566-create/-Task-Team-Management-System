import express from "express";
import Attendance from "../models/attendances.js";

const router = express.Router();

/* ================= HELPER FUNCTIONS ================= */

function convertTo24Hour(time12h) {
  const [time, period] = time12h.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return `${hours.toString().padStart(2, "0")}:${minutes}`;
}

function calculateDuration(timeIn, timeOut) {
  const start = new Date(`1970-01-01T${convertTo24Hour(timeIn)}:00`);
  const end = new Date(`1970-01-01T${convertTo24Hour(timeOut)}:00`);

  let diff = end - start;
  if (diff < 0) diff += 24 * 60 * 60 * 1000; // midnight safety

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  return `${hours}h ${minutes}m`;
}

/* ================= GET ATTENDANCE ================= */

router.get("/attendance", async (req, res) => {
  try {
    const attendances = await Attendance.find()
      .populate("employee", "firstName lastName")
      .sort({ createdAt: -1 });

    res.status(200).json(attendances);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= POST ATTENDANCE ================= */

router.post("/attendance", async (req, res) => {
  try {
    const { employeeId, day, timeIn, timeOut } = req.body;

    let attendance = await Attendance.findOne({
      employee: employeeId,
      day,
    });

    /* ===== TIME IN ===== */
    if (timeIn && !attendance) {
      const newAttendance = new Attendance({
        employee: employeeId,
        day,
        timeIn,
        timeOut: null,
        workingHours: null,
      });

      await newAttendance.save();
      return res.status(201).json({
        message: "Time In marked successfully",
      });
    }

    /* ===== TIME OUT ===== */
    if (timeOut && attendance?.timeIn) {
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
  } catch (err) {
    console.error("Attendance error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
