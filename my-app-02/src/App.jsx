// // import "./App.css";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import InfoPage from "./project/InfoPage";
// // import NotesExample from "./project/NotesExample";
// // import Navbar from "./project/Navbar"; // update path if needed
// // import { ToastContainer } from "react-toastify";
// // import "react-toastify/dist/ReactToastify.css";

// // export default function App() {
// //   return (
// //     <Router>
// //       <Navbar />
// //       <div className="page-container" style={{ marginTop: "80px" }}>
// //         <Routes>
// //           <Route path="/" element={<NotesExample />} />
// //           <Route path="/info" element={<InfoPage />} />
// //         </Routes>
// //       </div>
// //       <ToastContainer position="top-right" autoClose={3000} />
// //     </Router>
// //   );
// // }

// import "./App.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import InfoPage from "./project/InfoPage";
// import NotesExample from "./project/NotesExample";
// import { ToastContainer } from "react-toastify";
// import Navbar from "./project/Navbar";
// import { useState, useEffect } from "react";

// export default function App() {
//   const [darkMode, setDarkMode] = useState(false);

//   // Toggle function
//   const toggleTheme = () => {
//     setDarkMode((prev) => !prev);
//   };

//   // Add/remove class to body when darkMode changes
//   useEffect(() => {
//     if (darkMode) {
//       document.body.classList.add("dark-theme");
//     } else {
//       document.body.classList.remove("dark-theme");
//     }
//   }, [darkMode]);

//   return (
//     <Router>
//       <Navbar toggleTheme={toggleTheme} darkMode={darkMode} />
//       <div className="page-container" style={{ marginTop: "80px" }}>
//         <Routes>
//           <Route path="/" element={<NotesExample />} />
//           <Route path="/info" element={<InfoPage />} />
//         </Routes>
//       </div>
//       <ToastContainer position="top-right" autoClose={3000} />
//     </Router>
//   );
// }

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import InfoPage from "./project/InfoPage";
import NotesExample from "./project/NotesExample";
import Navbar from "./project/Navbar";
import LoginPage from "./project/LoginPage"; // ⬅️ new
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  const toggleTheme = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    if (darkMode) document.body.classList.add("dark-theme");
    else document.body.classList.remove("dark-theme");
  }, [darkMode]);

  return (
    <Router>
      <Navbar
        toggleTheme={toggleTheme}
        darkMode={darkMode}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />

      <div className="page-container" style={{ marginTop: "80px" }}>
        <Routes>
          <Route
            path="/login"
            element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
          />
          <Route
            path="/"
            element={
              isAuthenticated ? <Navigate to="/info" /> : <NotesExample />
            }
          />
          <Route path="/edit" element={<NotesExample />} />
          <Route
            path="/info"
            element={isAuthenticated ? <InfoPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}
