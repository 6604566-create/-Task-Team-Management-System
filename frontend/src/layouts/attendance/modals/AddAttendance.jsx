import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
  Spinner,
  useToast,
} from "@chakra-ui/react";

import api from "../../../api/axios";

export default function AddAttendanceModal({ isOpen, onClose }) {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [attendanceType, setAttendanceType] = useState("");

  /* ================= FETCH EMPLOYEES ================= */

  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    try {
      const res = await api.get("/api/employees");
      setEmployees(res.data);
    } catch {
      toast({
        title: "Failed to load employees",
        status: "error",
        position: "top",
      });
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchEmployees();
    else {
      setEmployeeId("");
      setAttendanceType("");
    }
  }, [isOpen]);

  /* ================= DATE & TIME ================= */

  const getCurrentDate = () =>
    new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const getCurrentTime = () => {
    const d = new Date();
    const hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";
    return `${hours % 12 || 12}:${minutes} ${period}`;
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/api/attendance", {
        employeeId,
        day: getCurrentDate(),
        timeIn: attendanceType === "time_in" ? getCurrentTime() : null,
        timeOut: attendanceType === "time_out" ? getCurrentTime() : null,
      });

      toast({
        title: "Attendance marked successfully",
        status: "success",
        position: "top",
      });

      onClose();
    } catch (error) {
      toast({
        title:
          error.response?.data?.message || "Failed to mark attendance",
        status: "error",
        position: "top",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>Add Attendance</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Select
              mt={3}
              placeholder={
                loadingEmployees
                  ? "Loading employees..."
                  : "Select Employee"
              }
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              isDisabled={loadingEmployees}
              required
            >
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.firstName} {emp.lastName}
                </option>
              ))}
            </Select>

            <Select
              mt={3}
              placeholder="Attendance Type"
              value={attendanceType}
              onChange={(e) => setAttendanceType(e.target.value)}
              required
            >
              <option value="time_in">Time In</option>
              <option value="time_out">Time Out</option>
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>

            <Button
              type="submit"
              colorScheme="teal"
              isDisabled={!employeeId || !attendanceType || loading}
            >
              {loading ? <Spinner size="sm" /> : "Add Attendance"}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
