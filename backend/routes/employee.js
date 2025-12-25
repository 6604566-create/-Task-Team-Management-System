import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import Employee from "../models/employees.js"; // ✅ FIXED PATH

const router = Router();

/* ================= ADD EMPLOYEE ================= */
router.post("/employee", authMiddleware, async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      residentialAddress,
      cnic,
      role,
      dateOfBirth,
      startDate,
      status,
      gender,
    } = req.body;

    /* ===== BASIC VALIDATION ===== */
    if (!firstName || !lastName || !email || !cnic || !role) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    /* ===== UNIQUE CHECKS ===== */
    const emailExists = await Employee.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const cnicExists = await Employee.findOne({ cnic });
    if (cnicExists) {
      return res.status(400).json({
        message: "CNIC already exists",
      });
    }

    /* ===== CREATE EMPLOYEE ===== */
    const employee = await Employee.create({
      firstName,
      lastName,
      email,
      phone,
      residentialAddress,
      cnic,
      role,
      dateOfBirth,
      startDate,
      status,
      gender,
    });

    res.status(201).json({
      message: "Employee added successfully",
      employee,
    });
  } catch (error) {
    console.error("Add Employee Error:", error);
    res.status(500).json({
      message: "Failed to add employee",
    });
  }
});

/* ================= GET ALL EMPLOYEES ================= */
router.get("/employees", authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    console.error("Fetch Employees Error:", error);
    res.status(500).json({
      message: "Failed to fetch employees",
    });
  }
});

/* ================= EMPLOYEE STATS ================= */
router.get("/employees-stats", authMiddleware, async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({
      status: "Active",
    });
    const inActiveEmployees = await Employee.countDocuments({
      status: "In Active",
    });
    const terminatedEmployees = await Employee.countDocuments({
      status: "Terminated",
    });

    res.status(200).json({
      totalEmployees,
      activeEmployees,
      inActiveEmployees,
      terminatedEmployees,
    });
  } catch (error) {
    console.error("Employee Stats Error:", error);
    res.status(500).json({
      message: "Failed to fetch employee stats",
    });
  }
});

export default router;
