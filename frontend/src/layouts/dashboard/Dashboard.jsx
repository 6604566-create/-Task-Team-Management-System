import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import Sidenav from "../../components/sidenav/Sidenav";
import Navbar from "../../components/navbar/Navbar";

import {
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { FcStatistics } from "react-icons/fc";

import welcomeImg from "../../assets/dashboard/welcome.png";

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
    marginBottom: "16px",
    fontWeight: 600,
    fontSize: "15px",
    color: "#f472b6",
  },

  welcome: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "30px",
  },

  welcomeTitle: {
    fontSize: "30px",
    fontWeight: 700,
    marginBottom: "10px",
  },

  welcomeSub: {
    fontSize: "15px",
    color: "#cbd5f5",
    maxWidth: "520px",
  },

  welcomeImg: {
    width: "230px",
    filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.6))",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
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

  progressGrid: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "20px",
  },

  progressLabel: {
    textAlign: "center",
    marginTop: "10px",
    fontSize: "14px",
    fontWeight: 500,
  },
};

/* ================= COMPONENT ================= */

function Dashboard() {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get("/api/dashboard");
      setDashboardData(res.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /* ================= LOADING / FALLBACK ================= */

  if (loading || !dashboardData) {
    return (
      <div style={styles.page}>
        <div style={styles.sidebar}>
          <Sidenav />
        </div>

        <div style={styles.content}>
          <Navbar />

          <div style={styles.glassCard}>
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <CircularProgress isIndeterminate color="pink.400" />
              <p style={{ marginTop: "16px", color: "#cbd5f5" }}>
                Loading dashboard...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div style={styles.page}>
      <div style={styles.sidebar}>
        <Sidenav />
      </div>

      <div style={styles.content}>
        <Navbar />

        {/* WELCOME */}
        <div style={styles.glassCard}>
          <div style={styles.welcome}>
            <div>
              <h1 style={styles.welcomeTitle}>
                Welcome to Task Management 👋
              </h1>
              <p style={styles.welcomeSub}>
                Manage employees, projects, tasks, attendance and timesheets
                from a single dashboard.
              </p>
            </div>

            <img src={welcomeImg} alt="welcome" style={styles.welcomeImg} />
          </div>
        </div>

        {/* GRID */}
        <div style={styles.grid}>
          {/* LEFT */}
          <div>
            <div style={styles.glassCard}>
              <div style={styles.headerRow}>
                <FcStatistics />
                Employees Overview
              </div>

              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Total Employees</div>
                  <div style={styles.statValue}>
                    {dashboardData.totalEmployees}
                  </div>
                </div>

                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Active Employees</div>
                  <div style={styles.statValue}>
                    {dashboardData.activeEmployees}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.glassCard}>
              <div style={styles.headerRow}>
                <FcStatistics />
                Projects Overview
              </div>

              <div style={styles.statsGrid}>
                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Total Projects</div>
                  <div style={styles.statValue}>
                    {dashboardData.totalProjects}
                  </div>
                </div>

                <div style={styles.statBox}>
                  <div style={styles.statLabel}>Completed Projects</div>
                  <div style={styles.statValue}>
                    {dashboardData.completedProjects}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            <div style={styles.glassCard}>
              <div style={styles.headerRow}>
                <FcStatistics />
                Employee Status
              </div>

              <div style={styles.progressGrid}>
                <div>
                  <CircularProgress
                    value={dashboardData.activePercentage}
                    color="green.300"
                  >
                    <CircularProgressLabel>
                      {dashboardData.activePercentage}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <div style={{ ...styles.progressLabel, color: "#4ade80" }}>
                    Active
                  </div>
                </div>

                <div>
                  <CircularProgress
                    value={dashboardData.inactivePercentage}
                    color="red.300"
                  >
                    <CircularProgressLabel>
                      {dashboardData.inactivePercentage}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <div style={{ ...styles.progressLabel, color: "#f87171" }}>
                    Inactive
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
