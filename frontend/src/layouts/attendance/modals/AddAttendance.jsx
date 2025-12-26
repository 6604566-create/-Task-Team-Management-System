import React, { useState, useEffect, useCallback } from "react";
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

import fetchClient from "../../../api/fetchClient";

/* ================= COMPONENT ================= */

export default function AddAttendanceModal({ isOpen, onClose }) {
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [attendanceType, setAttendanceType] = useState("");

  /* ================= FETCH EMPLOYEES ================= */

  const fetchEmployees = useCallback(async () => {
    setLoadingEmployees(true);
    try {
      const data = await fetchClient("/api/employees");
      setEmployees(data || []);
    } catch (error) {
      toast({
        title: error.message || "Failed to load employees",
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoadingEmployees(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isOpen) {
      fetchEmployees();
    } else {
      setEmployeeId("");
      setAttendanceType("");
    }
  }, [isOpen, fetchEmployees]);

  /* ================= DATE & TIME HELPERS ================= */

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  };

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
      await fetchClient("/api/attendance", {
        method: "POST",
        body: {
          employeeId,
          day: getCurrentDate(),
          timeIn: attendanceType === "time_in" ? getCurrentTime() : null,
          timeOut: attendanceType === "time_out" ? getCurrentTime() : null,
        },
      });

      toast({
        title: "Attendance marked successfully",
        status: "success",
        position: "top",
        duration: 4000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      toast({
        title: error.message || "Failed to mark attendance",
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

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
