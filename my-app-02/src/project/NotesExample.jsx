import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./NotesExample.css";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function NotesExample() {
  const location = useLocation();
  const editingEntry = location.state?.editingEntry || null;
  const mode = location.state?.mode || "create";

  useEffect(() => {
    document.title = mode === "edit" ? "Edit User" : "New Submission";
  }, [mode]);

  // If editing, fill the form with existing data
  useEffect(() => {
    if (editingEntry) {
      setName(editingEntry.name);
      setEmail(editingEntry.email);
      setAge(editingEntry.age);
      setPassword(editingEntry.password);
      setPhone(editingEntry.phone);
    }
  }, [editingEntry]);

  const [name, setName] = useState("");
  const [errorName, setErrorName] = useState("");
  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [age, setAge] = useState("");
  const [errorAge, setErrorAge] = useState("");
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [errorPhone, setErrorPhone] = useState("");
  const [infoList, setInfoList] = useState([]);

  const navigate = useNavigate();

  // useEffect(() => {
  //     const storedNotes = localStorage.getItem("UserData");
  //         if (storedNotes) {
  //             setInfoList(JSON.parse(storedNotes));
  //         }
  //     }, []);

  // useEffect(() => {
  //     if (infoList.length > 0) {
  //         localStorage.setItem("UserData", JSON.stringify(infoList));
  //     }
  // }, [infoList]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear previous error messages
    setErrorName("");
    setErrorEmail("");
    setErrorAge("");
    setErrorPassword("");
    setErrorPhone("");

    // Validate  placeholder=" " fields
    if (!name || !email || !age || !password) {
      alert("Please fill out all required fields!");
      return;
    }

    // Validate name length
    if (name.length > 25) {
      setErrorName("Name must be within 25 characters.");
      return;
    }

    // Validate email format
    if (!email.includes("@gmail.com")) {
      setErrorEmail("Please enter a valid Gmail address.");
      return;
    }

    // Validate age
    const numericAge = parseInt(age);
    if (isNaN(numericAge) || numericAge < 18 || numericAge > 100) {
      setErrorAge("Age must be a number between 18 and 100.");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setErrorPassword("Password must be at least 6 characters long.");
      return;
    }

    // Validate phone (optional)
    if (phone && !/^\d{10}$/.test(phone)) {
      setErrorPhone("Phone number must be exactly 10 digits.");
      return;
    }

    // Prepare data
    const userData = {
      name,
      email,
      age: numericAge,
      password,
      phone,
    };

    // Check if editing an existing entry
    if (editingEntry) {
      // UPDATE user
      fetch(`http://localhost:3001/api/update/${editingEntry.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "User updated successfully") {
            toast.success("User updated successfully!");
            navigate("/info");
          } else {
            toast.error("Failed to update user.");
          }
        })
        .catch(() => toast.error("Server error during update."));
    } else {
      // CREATE new user
      fetch("http://localhost:3001/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message === "User saved successfully") {
            setInfoList([...infoList, userData]);
            toast.success("User saved successfully!");
            navigate("/info");
          } else {
            toast.error("Failed to save user.");
          }
        })
        .catch(() => toast.error("Server error during save."));
    }

    // Reset form
    setName("");
    setEmail("");
    setAge("");
    setPassword("");
    setPhone("");
  };

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-20 col-lg-20">
          <h3 className="mb-3">Enter your details here!</h3>
          <form
            className="form"
            onSubmit={(e) => {
              e.stopPropagation();
              handleSubmit(e);
            }}
          >
            <div className="form-group-google">
              <input
                type="text"
                className="form-control"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value.trimStart())}
                placeholder=" "
              />
              <label className="form-label">Enter Your Name</label>
            </div>
            {errorName && <p className="text-danger">{errorName}</p>}

            <div className="form-group-google">
              <input
                type="text"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trimStart())}
                placeholder=" "
              />
              <label className="form-label">Enter Your Email</label>
            </div>
            {errorEmail && <p className="text-danger">{errorEmail}</p>}

            <div className="form-group-google">
              <input
                type="number"
                className="form-control"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder=" "
              />
              <label className="form-label">Enter Your Age</label>
            </div>
            {errorAge && <p className="text-danger">{errorAge}</p>}

            <div className="form-group-google">
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
              />
              <label className="form-label">Enter Your Password</label>
            </div>
            {errorPassword && <p className="text-danger">{errorPassword}</p>}

            <div className="form-group-google">
              <input
                type="tel"
                className="form-control"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value?.trimStart())}
                placeholder=" "
              />
              <label className="form-label">Enter your Mobile Number</label>
            </div>
            {errorPhone && <p className="text-danger">{errorPhone}</p>}
            <button type="submit" className="btn btn-primary">
              {mode === "edit" ? "Update" : "Submit"}
            </button>
            {mode === "edit" && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate("/info")}
              >
                Cancel
              </button>
            )}
          </form>

          {/* <button className="btn btn-link mt-3" onClick={() => navigate("/info")}>
                        View Submitted Information
                    </button> */}
        </div>
      </div>
    </div>
  );
}
