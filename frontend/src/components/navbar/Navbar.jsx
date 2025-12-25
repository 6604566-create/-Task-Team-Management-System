import React from "react";
import { IoIosNotifications, IoIosSearch } from "react-icons/io";

/* ================= COMPONENT ================= */

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");

    // ✅ universal logout (local + production)
    window.location.replace("/");
  };

  const today = new Date();
  const day = today.toLocaleDateString("en-US", { weekday: "long" });
  const date = today.toLocaleDateString("en-GB");

  return (
    <div style={styles.glassNavbar}>
      {/* LEFT LOGO */}
      <div style={styles.logo}>
        Task<span style={styles.logoAccent}>Flow</span>
      </div>

      {/* SEARCH BAR */}
      <div style={styles.searchBox}>
        <IoIosSearch style={styles.searchIcon} />
        <input
          type="text"
          placeholder="Search tasks, employees..."
          style={styles.searchInput}
        />
      </div>

      {/* RIGHT ACTIONS */}
      <div style={styles.right}>
        <div style={styles.iconBtn}>
          <IoIosNotifications />
        </div>

        <div style={styles.dateBox}>
          <span style={styles.day}>{day}</span>
          <span style={styles.date}>{date}</span>
        </div>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;

/* ================= STYLES ================= */

const styles = {
  glassNavbar: {
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    marginBottom: "24px",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(18px)",
    borderRadius: "20px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.45)",
    border: "1px solid rgba(255,255,255,0.15)",
    fontFamily: "Inter, sans-serif",
  },

  /* LOGO */
  logo: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "0.5px",
  },
  logoAccent: {
    color: "#ec4899",
  },

  /* SEARCH */
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "420px",
    height: "42px",
    padding: "0 14px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "30px",
  },
  searchIcon: {
    color: "#cbd5f5",
    fontSize: "18px",
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#ffffff",
    fontSize: "14px",
  },

  /* RIGHT */
  right: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },

  iconBtn: {
    height: "38px",
    width: "38px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#ffffff",
    fontSize: "18px",
  },

  dateBox: {
    display: "flex",
    flexDirection: "column",
    gap: "2px", // ✅ small spacing
    textAlign: "right",
  },

  day: {
    fontSize: "12px",
    color: "#e5e7eb",
    fontWeight: 500,
  },

  date: {
    fontSize: "12px",
    color: "#cbd5f5",
  },

  logoutBtn: {
    padding: "8px 18px",
    borderRadius: "30px",
    background: "#ec4899",
    color: "#ffffff",
    border: "none",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.3s ease",
  },
};
