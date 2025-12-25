import { Router } from "express";
import mongoose from "mongoose";
import authMiddleware from "../middleware/auth.js";
import Task from "../models/tasks.js";

const router = Router();

/* ================= ADD TASK ================= */
router.post("/task", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      assignTo,
      project,
      startDate,
      priority,
    } = req.body;

    if (
      !title ||
      !description ||
      !assignTo ||
      !project ||
      !startDate ||
      !priority
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const task = await Task.create({
      title,
      description,
      assignTo,
      project,
      startDate,
      priority,
      progress: 0,
      status: "Pending",
    });

    res.status(201).json({
      message: "Task added successfully",
      task,
    });
  } catch (error) {
    console.error("Add Task Error:", error);
    res.status(500).json({
      message: "Failed to add task",
    });
  }
});

/* ================= UPDATE TASK PROGRESS ================= */
router.patch("/task/:id/progress", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({
        message: "Progress must be between 0 and 100",
      });
    }

    let status = "Pending";
    if (progress > 0 && progress < 100) status = "In Progress";
    if (progress === 100) status = "Completed";

    const task = await Task.findByIdAndUpdate(
      id,
      { progress, status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Update Task Progress Error:", error);
    res.status(500).json({
      message: "Failed to update task progress",
    });
  }
});

/* ================= GET ALL TASKS ================= */
router.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignTo", "firstName lastName")
      .populate("project", "title")
      .sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.error("Fetch Tasks Error:", error);
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

/* ================= DELETE TASK ================= */
router.delete("/tasks/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({
      message: "Failed to delete task",
    });
  }
});

export default router;
