import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function LoginPage({ setIsAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Inside your LoginPage.jsx (or similar)
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
          localStorage.setItem("userId", data.user.id); // 👈 Store user ID
          localStorage.setItem("userName", data.user.name); // optional
          localStorage.setItem("userRole", data.user.role); // 👈 Store role

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
      <form onSubmit={handleLogin}>
        <div className="form-group-google">
          <input
            type="text"
            className="form-control"
            placeholder=" "
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label className="form-label">Username</label>
        </div>

        <div className="form-group-google">
          <input
            type="password"
            className="form-control"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="form-label">Password</label>
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}
