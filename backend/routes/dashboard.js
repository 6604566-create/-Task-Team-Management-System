import { Router } from "express";
import authMiddleware from "../middleware/auth.js";

import User from "../models/users.js";
import Project from "../models/projects.js";
import Task from "../models/tasks.js";

const router = Router();

/* ================= DASHBOARD ================= */

router.get("https://task-team-management-system-1.onrender.com/dashboard", authMiddleware, async (req, res) => {
  try {
    // EMPLOYEES
    const totalEmployees = await User.countDocuments();
    const activeEmployees = await User.countDocuments({ status: "Active" });

    // PROJECTS
    const totalProjects = await Project.countDocuments();
    const completedProjects = await Project.countDocuments({
      status: "Completed",
    });

    // TASKS
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ progress: 100 });

    // PERCENTAGES
    const activePercentage = totalEmployees
      ? Math.round((activeEmployees / totalEmployees) * 100)
      : 0;

    const inactivePercentage = 100 - activePercentage;

    // RESPONSE
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
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
});

export default router;
