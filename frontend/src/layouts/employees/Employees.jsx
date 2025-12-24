import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

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
  Spinner,
  Badge,
} from "@chakra-ui/react";

import { IoMdAdd } from "react-icons/io";
import { FcStatistics } from "react-icons/fc";

import AddEmployeeModal from "./modals/AddEmployee";
import api from "../../api/axios";

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    fontFamily: "Inter, sans-serif",
  },

  sidebar: {
    width: "240px",
  },

  content: {
    flex: 1,
    padding: "30px",
    color: "#fff",
  },

  glassCard: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
  },

  headerRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px",
    fontWeight: 600,
    fontSize: "15px",
    color: "#f472b6",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },

  statBox: {
    padding: "18px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
  },

  statLabel: {
    fontSize: "13px",
    color: "#cbd5f5",
  },

  statValue: {
    fontSize: "26px",
    fontWeight: 700,
    marginTop: "6px",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#ec4899",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "30px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
  },

  emptyState: {
    padding: "50px",
    textAlign: "center",
    color: "#cbd5f5",
    fontSize: "15px",
  },

  tableText: {
    color: "#fff",
  },
};

/* ================= COMPONENT ================= */

function Employees() {
  const navigate = useNavigate();

  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [employeesData, setEmployeesData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [employeesStats, setEmployeesStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    inActiveEmployees: 0,
    terminatedEmployees: 0,
  });

  const getEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/employees");
      setEmployeesData(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const getEmployeesStats = useCallback(async () => {
    try {
      const res = await api.get("/api/employees-stats");
      setEmployeesStats(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
      }
    }
  }, [navigate]);

  useEffect(() => {
    getEmployees();
    getEmployeesStats();
  }, [getEmployees, getEmployeesStats]);

  useEffect(() => {
    if (!isAddEmployeeModalOpen) {
      getEmployees();
      getEmployeesStats();
    }
  }, [isAddEmployeeModalOpen, getEmployees, getEmployeesStats]);

  return (
    <>
      <AddEmployeeModal
        isOpen={isAddEmployeeModalOpen}
        onClose={() => setIsAddEmployeeModalOpen(false)}
      />

      <div style={styles.page}>
        <div style={styles.sidebar}>
          <Sidenav />
        </div>

        <div style={styles.content}>
          <Navbar />

          {/* STATS */}
          <div style={styles.glassCard}>
            <div style={styles.headerRow}>
              <FcStatistics size={22} />
              Employees Overview
            </div>

            <div style={styles.statsGrid}>
              <div style={styles.statBox}>
                <div style={styles.statLabel}>Total</div>
                <div style={styles.statValue}>
                  {employeesStats.totalEmployees}
                </div>
              </div>

              <div style={styles.statBox}>
                <div style={styles.statLabel}>Active</div>
                <div style={styles.statValue}>
                  {employeesStats.activeEmployees}
                </div>
              </div>

              <div style={styles.statBox}>
                <div style={styles.statLabel}>Inactive</div>
                <div style={styles.statValue}>
                  {employeesStats.inActiveEmployees}
                </div>
              </div>

              <div style={styles.statBox}>
                <div style={styles.statLabel}>Terminated</div>
                <div style={styles.statValue}>
                  {employeesStats.terminatedEmployees}
                </div>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div style={styles.glassCard}>
            <div style={styles.tableHeader}>
              <h3>Employees</h3>
              <button
                style={styles.addBtn}
                onClick={() => setIsAddEmployeeModalOpen(true)}
              >
                <IoMdAdd /> Add Employee
              </button>
            </div>

            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th color="#cbd5f5">Name</Th>
                    <Th color="#cbd5f5">Email</Th>
                    <Th color="#cbd5f5">CNIC</Th>
                    <Th color="#cbd5f5">Role</Th>
                    <Th color="#cbd5f5">Status</Th>
                    <Th color="#cbd5f5">Gender</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={6} textAlign="center">
                        <Spinner color="pink.300" />
                      </Td>
                    </Tr>
                  ) : employeesData.length === 0 ? (
                    <Tr>
                      <Td colSpan={6}>
                        <div style={styles.emptyState}>
                          👥 No employees yet  
                          <br />
                          Click <b>Add Employee</b> to get started
                        </div>
                      </Td>
                    </Tr>
                  ) : (
                    employeesData.map((emp) => (
                      <Tr key={emp._id} _hover={{ bg: "rgba(255,255,255,0.08)" }}>
                        <Td style={styles.tableText}>
                          {emp.firstName} {emp.lastName}
                        </Td>
                        <Td style={styles.tableText}>{emp.email}</Td>
                        <Td style={styles.tableText}>{emp.cnic}</Td>
                        <Td style={styles.tableText}>{emp.role}</Td>
                        <Td>
                          <Badge
                            colorScheme={
                              emp.status === "Active"
                                ? "green"
                                : emp.status === "Terminated"
                                ? "red"
                                : "yellow"
                            }
                          >
                            {emp.status}
                          </Badge>
                        </Td>
                        <Td style={styles.tableText}>{emp.gender}</Td>
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

export default Employees;
