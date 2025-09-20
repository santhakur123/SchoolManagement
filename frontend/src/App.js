
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import SchoolTransactions from "./pages/SchoolTransactions";
import StatusCheck from "./pages/StatusCheck";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  const token = localStorage.getItem("token");

  
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark" ? true : false
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <div className={dark ? "dark bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}>
      <Router>
        {token ? (
          <>
          
            <nav className="bg-gray-800 dark:bg-gray-900 text-white p-4 flex gap-4 items-center">
              <a href="/">Dashboard</a>
              <a href="/school">By School</a>
              <a href="/status">Check Status</a>

              
              <button
                onClick={() => setDark(!dark)}
                className="ml-auto bg-gray-600 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-500 dark:hover:bg-gray-600"
              >
                {dark ? " Light" : " Dark"}
              </button>

              
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 ml-2"
              >
                Logout
              </button>
            </nav>

           
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/school" element={<SchoolTransactions />} />
              <Route path="/status" element={<StatusCheck />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </>
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
