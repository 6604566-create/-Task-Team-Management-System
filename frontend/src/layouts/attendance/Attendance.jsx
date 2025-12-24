import React, { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Sidenav from "../../components/sidenav/Sidenav";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Badge,
} from "@chakra-ui/react";

import { IoMdAdd } from "react-icons/io";
import AddAttendanceModal from "./modals/AddAttendance";
import api from "../../api/axios";

/* ================= COMPONENT ================= */

function Attendance() {
  const [isAddAttendanceModalOpen, setIsAddAttendanceModalOpen] =
    useState(false);
  const [attendanceData, setAttendanceData] = useState([]);

  const fetchAttendance = async () => {
    try {
      const res = await api.get("https://task-team-management-system-1.onrender.com/api/attendance");
      setAttendanceData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Attendance fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <>
      <AddAttendanceModal
        isOpen={isAddAttendanceModalOpen}
        onClose={() => {
          setIsAddAttendanceModalOpen(false);
          fetchAttendance();
        }}
      />

      {/* PAGE */}
      <div style={styles.page}>
        {/* SIDENAV */}
        <div style={styles.sidebar}>
          <Sidenav />
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          <Navbar />

          {/* HEADER */}
          <div style={styles.header}>
            <h2 style={styles.title}>Attendance</h2>
            <button
              style={styles.primaryBtn}
              onClick={() => setIsAddAttendanceModalOpen(true)}
            >
              <IoMdAdd /> Add Attendance
            </button>
          </div>

          {/* TABLE CARD */}
          <div style={styles.glassCard}>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th color="#cbd5f5">Day</Th>
                    <Th color="#cbd5f5">Time In</Th>
                    <Th color="#cbd5f5">Time Out</Th>
                    <Th color="#cbd5f5">Working Hours</Th>
                    <Th color="#cbd5f5">Status</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {attendanceData.length === 0 ? (
                    <Tr>
                      <Td colSpan={5} textAlign="center" color="#cbd5f5">
                        No attendance records found
                      </Td>
                    </Tr>
                  ) : (
                    attendanceData.map((att) => (
                      <Tr key={att._id}>
                        <Td color="#fff">{att.day}</Td>
                        <Td color="#fff">{att.timeIn || "—"}</Td>
                        <Td color="#fff">{att.timeOut || "—"}</Td>
                        <Td color="#fff">{att.workingHours || "—"}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              att.timeOut
                                ? "green"
                                : att.timeIn
                                ? "yellow"
                                : "red"
                            }
                          >
                            {att.timeOut
                              ? "Completed"
                              : att.timeIn
                              ? "Checked In"
                              : "Absent"}
                          </Badge>
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}

export default Attendance;

/* ================= STYLES ================= */

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    fontFamily: "Inter, sans-serif",
  },

  sidebar: {
    width: "240px",
  },

  content: {
    flex: 1,
    padding: "24px",
    overflowY: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  title: {
    fontSize: "26px",
    fontWeight: 600,
    color: "#fff",
  },

  glassCard: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
    border: "1px solid rgba(255,255,255,0.15)",
  },

  primaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#ec4899",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: "30px",
    cursor: "pointer",
    fontWeight: 600,
  },
};
