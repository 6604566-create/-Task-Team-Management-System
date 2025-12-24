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
  Spinner,
  Badge,
} from "@chakra-ui/react";

import { IoMdAdd } from "react-icons/io";
import { FcStatistics } from "react-icons/fc";

import AddTimesheetModal from "./modals/AddTimesheet";
import api from "../../api/axios";

/* ================= COMPONENT ================= */

function Timesheets() {
  const [isAddTimesheetOpen, setIsAddTimesheetOpen] = useState(false);
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalTimesheets: 0,
    developmentType: 0,
    testType: 0,
    otherType: 0,
  });

  /* FETCH TIMESHEETS */
  const fetchTimesheets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/timesheets");
      setTimesheets(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch timesheets error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* FETCH STATS */
  const fetchStats = async () => {
    try {
      const res = await api.get("/api/timesheets-stats");
      setStats({
        totalTimesheets: res.data?.totalTimesheets ?? 0,
        developmentType: res.data?.developmentType ?? 0,
        testType: res.data?.testType ?? 0,
        otherType: res.data?.otherType ?? 0,
      });
    } catch (err) {
      console.error("Fetch stats error:", err);
    }
  };

  useEffect(() => {
    fetchTimesheets();
    fetchStats();
  }, []);

  return (
    <>
      <AddTimesheetModal
        isOpen={isAddTimesheetOpen}
        onClose={() => {
          setIsAddTimesheetOpen(false);
          fetchTimesheets();
          fetchStats();
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

          {/* STATS */}
          <div style={styles.glassCard}>
            <div style={styles.cardHeader}>
              <FcStatistics />
              <span>Timesheets Overview</span>
            </div>

            <div style={styles.statsGrid}>
              <Stat label="Total" value={stats.totalTimesheets} />
              <Stat label="Development" value={stats.developmentType} />
              <Stat label="Testing" value={stats.testType} />
              <Stat label="Other" value={stats.otherType} />
            </div>
          </div>

          {/* TABLE */}
          <div style={styles.glassCard}>
            <div style={styles.tableHeader}>
              <h3>Timesheets</h3>
              <button
                style={styles.primaryBtn}
                onClick={() => setIsAddTimesheetOpen(true)}
              >
                <IoMdAdd /> Add Timesheet
              </button>
            </div>

            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th color="#cbd5f5">Notes</Th>
                    <Th color="#cbd5f5">Employee</Th>
                    <Th color="#cbd5f5">Project</Th>
                    <Th color="#cbd5f5">Task</Th>
                    <Th color="#cbd5f5">Hours</Th>
                    <Th color="#cbd5f5">Date</Th>
                    <Th color="#cbd5f5">Type</Th>
                  </Tr>
                </Thead>

                <Tbody>
                  {loading ? (
                    <Tr>
                      <Td colSpan={7} textAlign="center">
                        <Spinner />
                      </Td>
                    </Tr>
                  ) : timesheets.length === 0 ? (
                    <Tr>
                      <Td colSpan={7} textAlign="center" color="#cbd5f5">
                        No timesheets found
                      </Td>
                    </Tr>
                  ) : (
                    timesheets.map((ts) => (
                      <Tr key={ts._id}>
                        <Td color="#fff">{ts.notes || "—"}</Td>
                        <Td color="#fff">
                          {ts.employee
                            ? `${ts.employee.firstName} ${ts.employee.lastName}`
                            : "—"}
                        </Td>
                        <Td color="#fff">{ts.project?.title || "—"}</Td>
                        <Td color="#fff">{ts.task?.title || "—"}</Td>
                        <Td color="#fff">{ts.timeSpent ?? 0} hrs</Td>
                        <Td color="#fff">
                          {ts.workDate
                            ? new Date(ts.workDate).toLocaleDateString()
                            : "—"}
                        </Td>
                        <Td>
                          <Badge colorScheme="purple">
                            {ts.type || "—"}
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

/* ================= STAT COMPONENT ================= */
function Stat({ label, value }) {
  return (
    <div style={styles.statBox}>
      <span style={styles.statLabel}>{label}</span>
      <span style={styles.statValue}>{value}</span>
    </div>
  );
}

export default Timesheets;

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
    flex: 10,
    padding: "24px",
    overflowY: "auto",
  },

  glassCard: {
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    borderRadius: "20px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 30px 60px rgba(0,0,0,0.45)",
    border: "1px solid rgba(255,255,255,0.15)",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 600,
    color: "#fff",
    marginBottom: "16px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },

  statBox: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: "16px",
    padding: "16px",
    textAlign: "center",
  },

  statLabel: {
    fontSize: "22px",
    side: "block",
    color: "#cbd5f5",
  },

  statValue: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#fff",
  },

  tableHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    color: "#fff",
  },

  primaryBtn: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: "#ec4899",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "30px",
    cursor: "pointer",
    fontWeight: 600,
  },
};
