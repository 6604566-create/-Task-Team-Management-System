import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdWork,
  MdTask,
  MdAccessTime,
  MdEventAvailable,
  MdMenu,
  MdClose,
} from "react-icons/md";

/* 🔹 IMPORT YOUR PROFILE IMAGE */
import profileImg from "../../assets/sigin/my.png";
// 👆 change path if needed

/* ================= COMPONENT ================= */

function Sidenav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const menu = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard /> },
    { name: "Employees", path: "/admin/employees", icon: <MdPeople /> },
    { name: "Projects", path: "/admin/projects", icon: <MdWork /> },
    { name: "Tasks", path: "/admin/tasks", icon: <MdTask /> },
    { name: "Timesheets", path: "/admin/timesheets", icon: <MdAccessTime /> },
    {
      name: "Attendance",
      path: "/admin/attendance",
      icon: <MdEventAvailable />,
    },
  ];

  return (
    <>
      {/* TOGGLE BUTTON */}
      <div style={styles.toggleBtn} onClick={() => setOpen(!open)}>
        {open ? <MdClose /> : <MdMenu />}
      </div>

      {/* SIDEBAR */}
      <div
        style={{
          ...styles.sidebar,
          transform: open ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        {/* PROFILE */}
        <div style={styles.profile}>
          <div style={styles.avatar}>
            <img src={profileImg} alt="Profile" style={styles.avatarImg} />
          </div>
          <div style={styles.name}>Admin User</div>
          <div style={styles.email}>adimehta12@gmail.com</div>
        </div>

        {/* MENU */}
        <div style={styles.menu}>
          {menu.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  ...styles.item,
                  ...(isActive ? styles.itemActive : {}),
                }}
              >
                <span style={styles.icon}>{item.icon}</span>
                <span style={styles.text}>{item.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Sidenav;

/* ================= STYLES ================= */

const styles = {
  /* TOGGLE BUTTON */
  toggleBtn: {
    position: "fixed",
    top: "22px",
    left: "22px",
    zIndex: 999,
    height: "42px",
    width: "42px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#fff",
    fontSize: "22px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },

  /* SIDEBAR */
  sidebar: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "240px",
    height: "100vh",
    padding: "24px 0",
    zIndex: 998,
    background: "rgba(15,23,42,0.85)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
    transition: "transform 0.35s ease",
  },

  /* PROFILE */
  profile: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingBottom: "24px",
    borderBottom: "1px solid rgba(255,255,255,0.15)",
    marginBottom: "20px",
  },

  avatar: {
    width: "72px",
    height: "72px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "10px",
    overflow: "hidden",
  },

  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  },

  name: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#fff",
  },

  email: {
    fontSize: "12px",
    color: "#cbd5f5",
  },

  /* MENU */
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  item: {
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "0 20px",
    margin: "0 12px",
    cursor: "pointer",
    color: "#e5e7eb",
    transition: "all 0.25s ease",
  },

  itemActive: {
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    fontWeight: 600,
  },

  icon: {
    fontSize: "20px",
  },

  text: {
    fontSize: "14px",
  },
};
