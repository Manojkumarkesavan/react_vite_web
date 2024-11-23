import { useContext, useState } from "react";
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  Bars3Icon,
  ChevronDownIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import DarkModeContext from "../Utils/DarkModeContext.jsx";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal.jsx";

const Navbar = ({
  responseData,
  handleSidebarToggle,
  handleSidebarCollapse,
  sidebarCollapsed,
}) => {
  const [data] = useState(JSON.parse(responseData));
  const navigate = useNavigate();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { darkMode, setDarkMode } = useContext(DarkModeContext);

  const handleAvatarClick = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openLogoutModal = () => {
    setIsModalOpen(true);
    closeDropdown(); // Close the dropdown when modal opens
  };

  const closeLogoutModal = () => {
    setIsModalOpen(false);
  };

  const confirmLogout = () => {
    setIsModalOpen(false);
    handleSignOut();
  };
  const handleSignOut = () => {
    localStorage.removeItem("response_data");
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 fixed w-full z-50 top-0 left-0 h-16 flex items-center px-4">
      <div className="flex flex-wrap justify-between items-center w-full">
        <div className="flex items-center">
          {/* Sidebar Toggle Button */}
          <button
            onClick={handleSidebarToggle}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none lg:hidden mr-2"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          {/* Sidebar Collapse Button */}
          <button
            onClick={handleSidebarCollapse}
            className="hidden lg:inline-flex text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
          >
            {sidebarCollapsed ? (
              <ChevronDoubleRightIcon className="w-6 h-6" />
            ) : (
              <ChevronDoubleLeftIcon className="w-6 h-6" />
            )}
          </button>

          {/* App Logo or Title */}
          {!sidebarCollapsed ? (
            <span className="ml-2 text-xl font-semibold whitespace-nowrap text-gray-800 dark:text-gray-200">
              My App
            </span>
          ) : (
            <span className="ml-2 text-xl font-semibold whitespace-nowrap text-gray-800 dark:text-gray-200">
              My App
            </span>
          )}
        </div>

        <div className="flex items-center">
          {/* Dark Mode Toggle */}
          <button
            onClick={handleToggleDarkMode}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none mr-4"
          >
            {darkMode ? (
              <SunIcon className="w-6 h-6" />
            ) : (
              <MoonIcon className="w-6 h-6" />
            )}
          </button>

          {/* Profile Avatar and Dropdown */}
          <div className="relative inline-block text-left">
            <button
              onClick={handleAvatarClick}
              className="flex items-center focus:outline-none"
            >
              <img
                className="w-10 h-10 rounded-full"
                src="https://i.pravatar.cc/300"
                alt="Profile"
              />
              <div className="px-2 font-thin text-nowrap text-center text-bold dark:text-white">
                {data.users.firstName} {data.users.lastName}
              </div>
              <ChevronDownIcon className="w-5 h-5 ml-0 text-gray-600 dark:text-gray-300" />
            </button>

            {dropdownOpen && (
              <>
                {/* Overlay */}
                <div
                  className="fixed inset-0 h-full w-full z-10"
                  onClick={closeDropdown}
                ></div>

                {/* Dropdown Menu */}
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-20">
                  <div className="py-1" role="menu">
                    <a
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      role="menuitem"
                    >
                      {data.users.email}
                    </a>
                    <Link
                      to="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      role="menuitem"
                    >
                      Profile
                    </Link>
                    <Link
                      to="#"
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                      role="menuitem"
                      onClick={openLogoutModal}
                    >
                      Sign Out
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        onConfirm={confirmLogout}
        onCancel={closeLogoutModal}
      />
    </nav>
  );
};

export default Navbar;
