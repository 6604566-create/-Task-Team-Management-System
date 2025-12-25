import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

import Navbar from "../../components/navbar/Navbar";
import Sidenav from "../../components/sidenav/Sidenav";

import {
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { FcStatistics } from "react-icons/fc";

import welcomeImg from "../../assets/dashboard/welcome.png";

/* ================= COMPONENT ================= */

function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH DASHBOARD ================= */
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard"); // ✅ correct endpoint
        setData(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.sidebar}>
          <Sidenav />
        </div>

        <div style={styles.content}>
          <Navbar />
          <div style={styles.center}>
            <CircularProgress isIndeterminate color="pink.400" />
            <p style={{ marginTop: 16, color: "#cbd5f5" }}>
              Loading dashboard...
            </p>
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
              <h1 style={styles.title}>Welcome 👋</h1>
              <p style={styles.subtitle}>
                Manage employees, projects, tasks and attendance from one place.
              </p>
            </div>
            <img src={welcomeImg} alt="welcome" style={styles.image} />
          </div>
        </div>

        {/* STATS */}
        <div style={styles.grid}>
          {/* EMPLOYEES */}
          <div style={styles.glassCard}>
            <div style={styles.header}>
              <FcStatistics /> Employees Overview
            </div>

            <div style={styles.statsRow}>
              <div>
                <p>Total Employees</p>
                <h2>{data?.totalEmployees ?? 0}</h2>
              </div>
              <div>
                <p>Active Employees</p>
                <h2>{data?.activeEmployees ?? 0}</h2>
              </div>
            </div>
          </div>

          {/* STATUS */}
          <div style={styles.glassCard}>
            <div style={styles.header}>
              <FcStatistics /> Employee Status
            </div>

            <div style={styles.progressRow}>
              <div>
                <CircularProgress
                  value={data?.activePercentage ?? 0}
                  color="green.300"
                >
                  <CircularProgressLabel>
                    {data?.activePercentage ?? 0}%
                  </CircularProgressLabel>
                </CircularProgress>
                <p style={{ marginTop: 8 }}>Active</p>
              </div>

              <div>
                <CircularProgress
                  value={data?.inactivePercentage ?? 0}
                  color="red.300"
                >
                  <CircularProgressLabel>
                    {data?.inactivePercentage ?? 0}%
                  </CircularProgressLabel>
                </CircularProgress>
                <p style={{ marginTop: 8 }}>Inactive</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    fontFamily: "Inter, sans-serif",
  },

  sidebar: {
    width: "240px",
  },

  content: {
    flex: 1,
    padding: "24px",
    color: "#fff",
  },

  glassCard: {
    background: "rgba(255,255,255,0.12)",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "24px",
    backdropFilter: "blur(18px)",
  },

  welcome: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
  },

  title: {
    fontSize: "28px",
    fontWeight: 700,
  },

  subtitle: {
    fontSize: "15px",
    color: "#cbd5f5",
    marginTop: "8px",
  },

  image: {
    width: "200px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "24px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
    fontWeight: 600,
  },

  statsRow: {
    display: "flex",
    justifyContent: "space-between",
  },

  progressRow: {
    display: "flex",
    justifyContent: "space-around",
  },

  center: {
    textAlign: "center",
    padding: "80px",
  },
};
