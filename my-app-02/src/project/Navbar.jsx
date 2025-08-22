import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { ToastContainer, toast } from "react-toastify";

export default function Navbar({
  toggleTheme,
  darkMode,
  isAuthenticated,
  setIsAuthenticated,
}) {
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
        <div className="nav-logo">User App</div>

        <div className="nav-links">
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
              <button
                onClick={confirmLogout}
                className="nav-link"
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>

        <div>
          <button className="btn-theme" onClick={toggleTheme}>
            <span className="theme-icon">{darkMode ? "☀" : "🌙"}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

// import { Link, useLocation } from 'react-router-dom';

// export default function Navbar() {
//   const location = useLocation();

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
//       <div className="container-fluid">
//         <Link className="navbar-brand fw-bold" to="/">User App</Link>
//         <div>
//           {location.pathname === '/' && (
//             <Link className="nav-link text-white" to="/info">View details</Link>
//           )}
//           {location.pathname === '/info' && (
//             <Link className="nav-link text-white" to="/">Back to Form</Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
