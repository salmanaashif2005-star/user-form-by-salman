import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./LoginPage.css"; // 👈 Import CSS

export default function LoginPage({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("token", data.token);
          localStorage.setItem("userId", data.user.id);
          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userRole", data.user.role);
          toast.success("Login successful");
          setIsAuthenticated(true);
          navigate("/info");
        } else {
          toast.error("Invalid credentials");
        }
      })
      .catch(() => toast.error("Server error"));
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-3">Login</h3>
      <br />
      <form onSubmit={handleLogin}>
        <div className="form-group-google">
          <input
            type="text"
            className="form-control unselect-input"
            placeholder=" "
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="form-label">Username</label>
        </div>

        <div className="form-group-google">
          <input
            type={showPassword ? "text" : "password"}
            className="form-control unselect-input"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="form-label">Password</label>
        </div>

        {/* Checkbox for show/hide password */}
        <div className="show-password-checkbox">
          <input
            type="checkbox"
            id="showPassword"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
          <label htmlFor="showPassword"> Show Password</label>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Login
        </button>
      </form>
    </div>
  );
}
