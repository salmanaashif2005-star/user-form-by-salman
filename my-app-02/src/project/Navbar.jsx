import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ import toast
import "react-toastify/dist/ReactToastify.css";
import "./Navbar.css";

const Navbar = ({
  isAuthenticated,
  setIsAuthenticated,
  darkMode,
  toggleTheme,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const confirmLogout = () => {
    const toastId = toast.info(
      <div>
        Are you sure you want to Logout?
        <div
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
          }}
        >
          <button
            onClick={() => {
              handleLogout();
              toast.dismiss(toastId);
            }}
            style={{
              background: "#e63946",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(toastId)}
            style={{
              background: "#6c757d",
              color: "white",
              border: "none",
              padding: "6px 12px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        closeOnClick: false,
        closeButton: false,
        autoClose: false,
        draggable: false,
      }
    );
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo left */}
        <div className="nav-logo">User App</div>

        {/* Links center (desktop only) */}
        <div className="nav-links desktop-links">
          <Link to="/" className="nav-link">
            Register
          </Link>
          {!isAuthenticated ? (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          ) : (
            <>
              <Link to="/info" className="nav-link">
                View Details
              </Link>
              <button onClick={confirmLogout} className="nav-link logout-btn">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Right: theme + hamburger */}
        <div className="nav-right">
          <button className="btn-theme" onClick={toggleTheme}>
            <span className="theme-icon">{darkMode ? "☀️" : "🌙"}</span>
          </button>
          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Sidebar for mobile */}
      <div className={`sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>
          ×
        </button>
        <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
          Register
        </Link>
        {!isAuthenticated ? (
          <Link
            to="/login"
            className="nav-link"
            onClick={() => setMenuOpen(false)}
          >
            Login
          </Link>
        ) : (
          <>
            <Link
              to="/info"
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              View Details
            </Link>
            <button
              onClick={() => {
                setMenuOpen(false);
                confirmLogout();
              }}
              className="nav-link logout-btn"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
