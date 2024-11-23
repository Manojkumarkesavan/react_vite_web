import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const responseData = localStorage.getItem("response_data");
  const isAuthenticated = responseData !== null;

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate("/login");
  }

  const [sidebarOpen, setSidebarOpen] = useState(false); // For mobile view
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For desktop view

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleOutsideClick = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-800">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} isCollapsed={sidebarCollapsed} />

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 lg:hidden"
          onClick={handleOutsideClick}
        ></div>
      )}

      <div className="flex-1 flex flex-col overflow-auto">
        {/* Navbar */}
        <Navbar
          responseData={responseData}
          handleSidebarToggle={handleSidebarToggle}
          handleSidebarCollapse={handleSidebarCollapse}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* MainContent Content */}
        <div
          className={`flex-1 mt-12 p-4 lg:p-8 pt-16 transition-all duration-200 ${
            sidebarCollapsed ? "lg:ml-2 mt-10 pt-16" : "lg:ml-4 mt-12 pt-16"
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
