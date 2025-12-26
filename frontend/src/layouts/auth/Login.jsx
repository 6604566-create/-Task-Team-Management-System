import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import fetchClient from "../../api/fetchClient";

import girlImg from "../../assets/sigin/girl.png";

/* ================= COMPONENT ================= */

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /* ================= HANDLERS ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ fetchClient usage (FUNCTION, not axios)
      const data = await fetchClient("/api/login", {
        method: "POST",
        body: formData,
      });

      // ✅ Save token
      localStorage.setItem("token", data.token);

      // ✅ Redirect
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      alert(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* LEFT */}
        <div style={styles.left}>
          <p style={styles.logo}>TASKFLOW</p>
          <p style={styles.welcome}>Welcome back !!!</p>
          <h1 style={styles.heading}>Log In</h1>

          <form onSubmit={handleSubmit}>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="login@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="************"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              style={styles.loginBtn}
              disabled={loading}
            >
              {loading ? "Logging in..." : "LOGIN →"}
            </button>
          </form>

          <p style={styles.footer}>
            Don’t have an account?{" "}
            <Link to="/register" style={styles.signup}>
              Sign up
            </Link>
          </p>
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <img src={girlImg} alt="illustration" style={styles.image} />
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0b3c5d, #3a0a45, #0b3c5d)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Inter, sans-serif",
  },

  card: {
    width: "1250px",
    background: "#fff",
    borderRadius: "34px",
    display: "flex",
    overflow: "hidden",
  },

  left: {
    width: "60%",
    padding: "40px",
  },

  logo: {
    color: "#e07a9a",
    fontWeight: 900,
    fontSize: "29px",
  },

  welcome: {
    fontSize: "18px",
    marginTop: "12px",
  },

  heading: {
    fontSize: "56px",
    fontWeight: 700,
    margin: "12px 0 40px",
  },

  label: {
    fontSize: "18px",
    marginBottom: "8px",
    display: "block",
  },

  input: {
    width: "100%",
    height: "64px",
    background: "#cfe6f3",
    border: "none",
    borderRadius: "10px",
    padding: "0 20px",
    marginBottom: "26px",
    fontSize: "18px",
    outline: "none",
  },

  loginBtn: {
    marginTop: "10px",
    width: "200px",
    height: "56px",
    background: "#e07a9a",
    border: "none",
    borderRadius: "28px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },

  footer: {
    marginTop: "35px",
    fontSize: "16px",
  },

  signup: {
    color: "#e07a9a",
    fontWeight: 600,
    textDecoration: "none",
  },

  right: {
    width: "40%",
    background: "#cfe6f3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    width: "90%",
    animation: "float 6s ease-in-out infinite",
  },
};
