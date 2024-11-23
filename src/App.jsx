import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login.jsx";
import SignUp from "./pages/SignUp.jsx";
import MainContent from "./components/MainContent.jsx";
import { DarkModeProvider } from "./Utils/DarkModeContext.jsx";
import DashboardLayout from "./pages/DashboardLayout.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import ProtectedRoute from "./Utils/ProtectedRoute.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import JsonFormatter from "./pages/JsonFormatter.jsx";
import Chat from "./pages/chat/Chat.jsx";

function App() {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MainContent />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="chat" element={<Chat />} />
            <Route
              path="utilities/json-formatter"
              element={<JsonFormatter />}
            />
            {/* Add more routes as needed */}
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DarkModeProvider>
    </BrowserRouter>
  );
}

export default App;
