import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import Timesheet from "../models/timesheets.js";

const router = Router();

/* ================= ADD TIMESHEET ================= */
router.post("/timesheet", authMiddleware, async (req, res) => {
  try {
    const {
      notes,
      employee,
      project,
      task,
      progress,
      timeSpent,
      workDate,
      type,
    } = req.body;

    if (!employee || !project || !task) {
      return res
        .status(400)
        .json({ message: "Employee, Project and Task are required" });
    }

    if (!workDate) {
      return res.status(400).json({ message: "Work date is required" });
    }

    if (!timeSpent) {
      return res.status(400).json({ message: "Time spent is required" });
    }

    if (!["Development", "Testing", "Other"].includes(type)) {
      return res.status(400).json({ message: "Invalid timesheet type" });
    }

    const timesheet = await Timesheet.create({
      notes,
      employee,
      project,
      task,
      progress,
      timeSpent,
      workDate,
      type,
    });

    res.status(201).json({
      message: "Timesheet added successfully",
      timesheet,
    });
  } catch (error) {
    console.error("Add Timesheet Error:", error);
    res.status(500).json({ message: "Failed to add timesheet" });
  }
});

/* ================= GET ALL TIMESHEETS ================= */
router.get("/timesheets", authMiddleware, async (req, res) => {
  try {
    const timesheets = await Timesheet.find()
      .populate("employee", "firstName lastName")
      .populate("project", "title")
      .populate("task", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(timesheets);
  } catch (error) {
    console.error("Fetch Timesheets Error:", error);
    res.status(500).json({ message: "Failed to fetch timesheets" });
  }
});

/* ================= TIMESHEET STATS ================= */
router.get("/timesheets/stats", authMiddleware, async (req, res) => {
  try {
    const total = await Timesheet.countDocuments();

    const totalHoursAgg = await Timesheet.aggregate([
      { $group: { _id: null, totalHours: { $sum: "$timeSpent" } } },
    ]);

    res.status(200).json({
      total,
      totalHours: totalHoursAgg[0]?.totalHours || 0,
    });
  } catch (error) {
    console.error("Timesheet Stats Error:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

export default router;
