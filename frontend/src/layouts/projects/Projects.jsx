import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import Sidenav from "../../components/sidenav/Sidenav";
import Navbar from "../../components/navbar/Navbar";

import {
  CircularProgress,
  CircularProgressLabel,
  Tag,
} from "@chakra-ui/react";

import { IoReaderOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { FcStatistics } from "react-icons/fc";

import AddProjectModal from "./modals/AddProject";
import ReadProjectModal from "./modals/ReadProject";
import fetchClient from "../../api/fetchClient";

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    fontFamily: "Inter, sans-serif",
  },
  sidebar: { width: "240px" },
  content: { flex: 1, padding: "30px", color: "#fff" },

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
    textAlign: "center",
  },

  statValue: { fontSize: "26px", fontWeight: 700 },
  statLabel: { fontSize: "13px", color: "#cbd5f5" },

  grid: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" },

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
    fontWeight: 600,
  },

  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: "18px",
    marginTop: "16px",
  },

  projectCard: {
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(14px)",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
  },

  projectTitle: { fontSize: "16px", fontWeight: 600 },
  projectDesc: {
    fontSize: "13px",
    color: "#cbd5f5",
    margin: "8px 0 14px",
  },

  dateText: { fontSize: "12px", color: "#94a3b8", marginTop: "10px" },

  progressCard: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "24px",
    textAlign: "center",
  },

  empty: { padding: "40px", textAlign: "center", color: "#cbd5f5" },
};

/* ================= COMPONENT ================= */

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isReadProjectModalOpen, setIsReadProjectModalOpen] = useState(false);

  /* ================= FETCH PROJECTS ================= */

  const fetchProjects = useCallback(async () => {
    try {
      const data = await fetchClient("/api/projects");
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Projects fetch error:", err.message);
      localStorage.removeItem("token");
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  /* ================= DELETE ================= */

  const handleDeleteProject = async (id) => {
    try {
      await fetchClient(`/api/projects/${id}`, { method: "DELETE" });
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete project error:", err.message);
    }
  };

  /* ================= STATS ================= */

  const total = projects.length;
  const completed = projects.filter((p) => p.status === "Completed").length;
  const inProgress = projects.filter((p) => p.status === "In Progress").length;
  const pending = projects.filter((p) => p.status === "On Hold").length;

  return (
    <>
      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => {
          setIsAddProjectModalOpen(false);
          fetchProjects();
        }}
      />

      <ReadProjectModal
        isOpen={isReadProjectModalOpen}
        onClose={() => setIsReadProjectModalOpen(false)}
        project={selectedProject}
        onDelete={handleDeleteProject}
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
              Projects Overview
            </div>

            <div style={styles.statsGrid}>
              {[
                { label: "Total", value: total },
                { label: "Completed", value: completed },
                { label: "In Progress", value: inProgress },
                { label: "Pending", value: pending },
              ].map((s) => (
                <div key={s.label} style={styles.statBox}>
                  <div style={styles.statValue}>{s.value}</div>
                  <div style={styles.statLabel}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN GRID */}
          <div style={styles.grid}>
            {/* LEFT */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h2>Projects</h2>
                <button
                  style={styles.addBtn}
                  onClick={() => setIsAddProjectModalOpen(true)}
                >
                  <IoMdAdd /> Add Project
                </button>
              </div>

              {projects.length === 0 ? (
                <div style={styles.empty}>📁 No projects found</div>
              ) : (
                <div style={styles.projectGrid}>
                  {projects.map((project) => (
                    <div key={project._id} style={styles.projectCard}>
                      <h3 style={styles.projectTitle}>{project.title}</h3>

                      <p style={styles.projectDesc}>
                        {(project.description || "").slice(0, 80)}…
                      </p>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Tag>{project.priority}</Tag>

                        <IoReaderOutline
                          style={{ cursor: "pointer", fontSize: "18px" }}
                          onClick={() => {
                            setSelectedProject(project);
                            setIsReadProjectModalOpen(true);
                          }}
                        />
                      </div>

                      <p style={styles.dateText}>
                        📅{" "}
                        {project.createdAt
                          ? new Date(project.createdAt).toLocaleDateString(
                              "en-IN"
                            )
                          : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT */}
            <div>
              <div style={styles.progressCard}>
                <p style={{ fontWeight: 600, marginBottom: "14px" }}>
                  Project Completion
                </p>

                <CircularProgress
                  value={total ? (completed / total) * 100 : 0}
                  size="130px"
                  color="green.300"
                >
                  <CircularProgressLabel>
                    {total ? Math.round((completed / total) * 100) : 0}%
                  </CircularProgressLabel>
                </CircularProgress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Projects;
