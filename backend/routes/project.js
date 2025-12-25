import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import Project from "../models/projects.js";

const router = Router();

/* ================= ADD PROJECT ================= */
/**
 * POST /project
 */
router.post("/project", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      clientName,
      startDate,
      status,
      priority,
    } = req.body;

    /* ===== VALIDATION ===== */
    if (!title || !clientName || !startDate || !status || !priority) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    /* ===== OPTIONAL DUPLICATE CHECK ===== */
    const existingProject = await Project.findOne({
      title,
      clientName,
    });

    if (existingProject) {
      return res.status(400).json({
        message: "Project already exists for this client",
      });
    }

    /* ===== CREATE PROJECT ===== */
    const newProject = await Project.create({
      title,
      description,
      clientName,
      startDate,
      status,
      priority,
    });

    res.status(201).json({
      message: "Project added successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Add Project Error:", error);
    res.status(500).json({
      message: "Failed to add project",
    });
  }
});

/* ================= GET ALL PROJECTS ================= */
/**
 * GET /projects
 */
router.get("/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    console.error("Fetch Projects Error:", error);
    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
});

/* ================= DELETE PROJECT ================= */
/**
 * DELETE /projects/:id
 */
router.delete("/projects/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({
      message: "Failed to delete project",
    });
  }
});

export default router;
