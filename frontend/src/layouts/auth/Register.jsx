import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from '../../api/axios.js'

import girlImg from "../../assets/sigin/signup.png";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("/api/register", formData);
      navigate("/", { replace: true });
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* LEFT */}
        <div style={styles.left}>
          <p style={styles.logo}>TASKFLOW</p>
          <p style={styles.welcome}>Create your account !!!</p>
          <h1 style={styles.heading}>Sign Up</h1>

          <form onSubmit={handleSubmit} style={styles.form}>
            <label style={styles.label}>First Name</label>
            <input
              style={styles.input}
              type="text"
              name="firstName"
              placeholder="Aditya"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Last Name</label>
            <input
              style={styles.input}
              type="text"
              name="lastName"
              placeholder="Raj"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="adityaraj@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
            />

          

            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="************"
              value={formData.password}
              onChange={handleChange}
              required
            />

            {/* ✅ BUTTON FIXED */}
            <button style={styles.submitBtn} disabled={loading}>
              {loading ? "Creating..." : "SIGN UP →"}
            </button>

            <p style={styles.footer}>
              Already have an account?{" "}
              <Link to="/" style={styles.link}>
                Login
              </Link>
            </p>
          </form>
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
    background: "linear-gradient(135deg, #0b3c5d, #3a0a45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, sans-serif",
  },

card: {
  width: "1250px",
  minHeight: "20px",   // ✅ FIXED
  background: "#fff",
  borderRadius: "34px",
  display: "flex",
  overflow: "hidden",
},

left: {
  width: "55%",
  padding: "30px",
  overflowY: "auto",    // ✅ FIXED
},

logo: {
    color: "#e07a9a",
    fontWeight: 900,
    fontSize: "29px",
  },

  welcome: {
    marginTop: "14px",
    fontSize: "18px",
  },

  heading: {
    fontSize: "56px",
    fontWeight: 700,
    margin: "16px 0 40px",
  },

  form: {
    paddingBottom: "40px",
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
    borderRadius: "10px",
    border: "none",
    padding: "0 20px",
    fontSize: "18px",
    marginBottom: "22px",
    outline: "none",
  },

  passwordRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inlineLink: {
    color: "#e07a9a",
    fontWeight: 600,
    fontSize: "14px",
    textDecoration: "none",
  },

  /* ✅ BUTTON NOW VISIBLE */
  submitBtn: {
    marginTop: "20px",
    width: "220px",
    height: "58px",
    background: "#e07a9a",
    borderRadius: "30px",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: 600,
    cursor: "pointer",
  },

  footer: {
    marginTop: "32px",
    fontSize: "16px",
  },

  link: {
    color: "#e07a9a",
    fontWeight: 600,
    textDecoration: "none",
  },

  right: {
    width: "45%",
    background: "#cfe6f3",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: "90%",
    animation: "float 6s ease-in-out infinite",
  },
};
