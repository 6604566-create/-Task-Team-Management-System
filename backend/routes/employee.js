import { Router } from "express";
import authMiddleware from "../middleware/auth.js";
import Employee from "../models/employees.js";

const router = Router();

// ================= ADD EMPLOYEE =================
router.post("https://task-team-management-system-1.onrender.com/employee", authMiddleware, async (req, res) => {
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

    if (await Employee.findOne({ email }))
      return res.status(400).json({ message: "Email already exists" });

    if (await Employee.findOne({ cnic }))
      return res.status(400).json({ message: "CNIC already exists" });

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
    res.status(500).json({ message: error.message });
  }
});

// ================= GET ALL EMPLOYEES =================
router.get("https://task-team-management-system-1.onrender.com/employees", authMiddleware, async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ================= EMPLOYEE STATS =================
router.get("https://task-team-management-system-1.onrender.com/employees-stats", authMiddleware, async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: "Active" });
    const inActiveEmployees = await Employee.countDocuments({ status: "In Active" });
    const terminatedEmployees = await Employee.countDocuments({ status: "Terminated" });

    res.status(200).json({
      totalEmployees,
      activeEmployees,
      inActiveEmployees,
      terminatedEmployees,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
