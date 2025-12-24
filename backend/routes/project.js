import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import Project from '../models/projects.js';

const router = Router();

/**
 * ✅ Add Project
 * POST /project
 */
router.post('/project', authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      clientName,
      startDate,
      status,
      priority,
    } = req.body;

    const newProject = new Project({
      title,
      description,
      clientName,
      startDate,
      status,
      priority,
    });

    await newProject.save();

    res.status(201).json({
      message: 'Project added successfully',
      project: newProject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * ✅ Get All Projects
 * GET /projects
 */
router.get('/projects', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * ✅ Delete Project
 * DELETE /projects/:id
 */
router.delete('/projects/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
