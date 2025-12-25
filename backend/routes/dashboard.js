import { Router } from "express";
import authMiddleware from "../middleware/auth.js";

import Employee from "../models/employees.js";
import Project from "../models/projects.js";
import Task from "../models/tasks.js";

const router = Router();

/* ================= DASHBOARD ================= */

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    /* ===== EMPLOYEES ===== */
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({
      status: "Active",
    });

    /* ===== PROJECTS ===== */
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({
      status: "Completed",
    });

    /* ===== TASKS ===== */
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({
      status: "Completed",
    });

    /* ===== PERCENTAGES ===== */
    const activePercentage = totalEmployees
      ? Math.round((activeEmployees / totalEmployees) * 100)
      : 0;

    const inactivePercentage = 100 - activePercentage;

    /* ===== RESPONSE ===== */
    res.status(200).json({
      totalEmployees,
      activeEmployees,
      totalProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      activePercentage,
      inactivePercentage,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({
      message: "Dashboard fetch failed",
    });
  }
});

export default router;
