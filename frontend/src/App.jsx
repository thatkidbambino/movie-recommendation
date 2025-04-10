import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import * as Toast from "@radix-ui/react-toast";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("token");
    setToastMessage("Logged out successfully.");
    setShowToast(true);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Navbar onLogout={handleLogout} />
        <main className="p-6 max-w-5xl mx-auto">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={token ? "/dashboard" : "/login"} />}
            />
            <Route
              path="/login"
              element={<LoginPage setToken={setToken} setToastMessage={setToastMessage} setShowToast={setShowToast} />}
            />
            <Route
              path="/register"
              element={<RegisterPage setToastMessage={setToastMessage} setShowToast={setShowToast} />}
            />
            <Route
              path="/dashboard"
              element={token ? <Dashboard token={token} /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>

        {/* Toast Notifications */}
        <Toast.Provider>
          <Toast.Root
            className="bg-gray-800 text-white p-4 rounded-md shadow-lg"
            open={showToast}
            onOpenChange={setShowToast}
          >
            <Toast.Title className="font-bold">Notice</Toast.Title>
            <Toast.Description>{toastMessage}</Toast.Description>
          </Toast.Root>
          <Toast.Viewport className="fixed bottom-5 right-5" />
        </Toast.Provider>
      </div>
    </Router>
  );
}

export default App;
