import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./InfoPage.css";

export default function InfoPage() {
  const [infoList, setInfoList] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const userId = localStorage.getItem("userId");
  //   const role = localStorage.getItem("userRole");

  //   if (role === "admin") {
  //     fetch("http://localhost:3001/api/data", {
  //       method: "GET",
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("token"), // if you have a token
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => setInfoList(data))
  //       .catch((err) => console.error("Failed to load all users:", err));
  //   } else if (userId) {
  //     fetch(`http://localhost:3001/api/user/${userId}`, {
  //       method: "GET",
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("token"), // if you have a token
  //         "Content-Type": "application/json",
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((data) => setInfoList([data]))
  //       .catch((err) =>
  //         console.error("Failed to load user-specific data from server:", err)
  //       );
  //   }
  // }, []);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("token");

    let url = "http://localhost:3001/api/users"; // default → all users (for admin)
    if (role !== "admin" && userId) {
      url = `http://localhost:3001/api/users?id=${userId}`; // specific user
    }

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // If single user → backend returns an object, wrap it in an array
        setInfoList(Array.isArray(data) ? data : [data]);
      })
      .catch((err) => console.error("Failed to load users:", err));
  }, []);

  // InfoPage.jsx
  const startEditing = (entry) => {
      navigate("/edit", {
        state: {
          editingEntry: entry,
          mode: "edit",
        },
      });
  };

  const confirmEdit = (entry) => {
    const toastId = toast.info(
      <div>
        Are you sure you want to edit this entry?
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
              toast.dismiss(toastId);
              startEditing(entry);
            }}
            style={{
              background: "#28a745",
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

  const confirmDelete = (id) => {
    const toastId = toast.info(
      <div>
        Are you sure you want to delete this entry?
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
              handleRemove(id);
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

  const handleRemove = (id) => {
    fetch(`http://localhost:3001/api/delete/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"), // if you have a token
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => {
        setInfoList(infoList.filter((entry) => entry.id !== id));
      });
  };

  return (
    <div className="container">
      <h3>Your Submitted Information</h3>
      {infoList.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <ul className="list-group">
          {infoList.map((entry) => (
            <li
              key={entry.id}
              className="list-group-item d-flex justify-content-between align-items-start"
            >
              <div>
                <strong>Name:</strong> {entry.name} <br />
                <strong>Mail Id:</strong> {entry.email} <br />
                <strong>Age:</strong> {entry.age} <br />
                <strong>Mobile:</strong> {entry.phone}
              </div>
              <button
                type="button"
                className="btn btn-success btn-sm"
                onClick={() => confirmEdit(entry)}
              >
                Edit
              </button>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => confirmDelete(entry.id)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* <button className="btn btn-link mt-3" onClick={() => navigate("/Login")}>
        Logout
      </button> */}
    </div>
  );
}
