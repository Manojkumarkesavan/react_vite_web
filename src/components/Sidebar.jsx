import { Link } from "react-router-dom";

import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const Sidebar = ({ isOpen, isCollapsed }) => {
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);

  // Function to toggle the accordion
  const toggleUtilities = () => {
    setIsUtilitiesOpen(!isUtilitiesOpen);
  };
  return (
    <aside
      className={`fixed mt-10 z-40 lg:pt-0 lg:static lg:translate-x-0 bg-white dark:bg-gray-900 ${
        isCollapsed ? "w-20" : "w-64"
      } transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-200 ease-in-out h-full overflow-y-auto`}
    >
      <div className="h-full overflow-y-auto">
        <nav className="mt-10">
          <Link
            to="/dashboard"
            className="flex items-center mt-4 py-2 px-6 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <HomeIcon className="h-6 w-6" />
            {!isCollapsed && <span className="mx-3">Dashboard</span>}
          </Link>
          {/* Profile Link */}
          <Link
            to="/dashboard/profile"
            className="flex items-center mt-4 py-2 px-6 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <UserIcon className="h-6 w-6" />
            {!isCollapsed && <span className="mx-3">Profile</span>}
          </Link>
          {/* Settings Link */}
          <Link
            to="/dashboard/portfolio"
            className="flex items-center mt-4 py-2 px-6 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path
                fillRule="evenodd"
                d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 0 0 3 3h15a3 3 0 0 1-3-3V4.875C17.25 3.839 16.41 3 15.375 3H4.125ZM12 9.75a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H12Zm-.75-2.25a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75ZM6 12.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5H6Zm-.75 3.75a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75ZM6 6.75a.75.75 0 0 0-.75.75v3c0 .414.336.75.75.75h3a.75.75 0 0 0 .75-.75v-3A.75.75 0 0 0 9 6.75H6Z"
                clipRule="evenodd"
              />
              <path d="M18.75 6.75h1.875c.621 0 1.125.504 1.125 1.125V18a1.5 1.5 0 0 1-3 0V6.75Z" />
            </svg>

            {!isCollapsed && <span className="mx-3">Portfolio</span>}
          </Link>

          <Link
            to="/dashboard/chat"
            className="flex items-center mt-4 py-2 px-6 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
                stroke="#374151"
                strokeWidth="1.5"
                fillRule="evenodd"
                clipRule="evenodd"
              />
              <path
                opacity="0.5"
                d="M8 12H8.009M11.991 12H12M15.991 12H16"
                stroke="#374151"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {!isCollapsed && <span className="mx-3">Chat</span>}
          </Link>

          <div className="mt-4">
            <button
              onClick={toggleUtilities}
              className="flex items-center w-full py-2 px-6 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              <svg
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 489.347 489.347"
                className="h-6 w-6"
                fill="currentColor"
              >
                <g>
                  <path
                    d="M412.642,345.939l-59.523-14.229l-66.352-66.352l51.12-51.055c11.874,4.167,24.216,6.203,36.499,6.202
		c28.736-0.002,57.122-11.149,78.233-32.221c32.686-32.626,41.544-82.646,22.043-124.466l-9.042-19.391l-53.807,53.682
		l-24.986-24.941l53.822-53.696L421.17,10.42C379.3-9.036,329.218-0.195,296.546,32.417
		c-30.131,30.078-40.012,74.943-26.092,114.534l-20.111,20.086L102.13,18.837C91.061,7.731,76.32,1.605,60.621,1.587
		c-0.023,0-0.044,0-0.067,0c-15.696,0-30.45,6.104-41.553,17.195C7.886,29.897,1.77,44.669,1.778,60.378
		c0.008,15.697,6.129,30.456,17.233,41.553L167.18,250.094l-20.155,20.129c-39.652-13.917-84.597-4.061-114.733,26.02
		C-0.393,328.869-9.252,378.888,10.25,420.708l9.042,19.391l53.806-53.681l24.986,24.94l-53.822,53.697l19.48,9.051
		c14.814,6.883,30.652,10.224,46.388,10.224c28.738-0.001,57.124-11.148,78.235-32.221c30.132-30.078,40.013-74.943,26.093-114.534
		l51.082-51.018l66.366,66.366l14.229,59.523l76.705,76.706l66.507-66.507L412.642,345.939z M301.691,144.194
		c-14.181-30.419-7.73-66.807,16.05-90.545c18.28-18.246,44.036-26.278,68.827-22.6l-42.211,42.113l67.451,67.328l42.24-42.142
		c3.697,24.738-4.343,50.456-22.622,68.702c-23.802,23.759-60.288,30.197-90.793,16.02l-9.505-4.417l-34.603,34.559l-24.968-24.965
		l34.573-34.529L301.691,144.194z M31.778,60.362c-0.004-7.69,2.992-14.923,8.43-20.362c5.433-5.426,12.657-8.414,20.347-8.414
		c7.711,0.009,14.918,3.002,20.345,8.446l194.398,194.38l-40.711,40.659L40.221,80.714C34.781,75.277,31.782,68.049,31.778,60.362z
		 M167.171,430.877c-18.28,18.246-44.038,26.278-68.827,22.6l42.211-42.112l-67.451-67.329l-42.24,42.142
		c-3.698-24.737,4.343-50.455,22.623-68.702c23.801-23.758,60.288-30.197,90.792-16.021l9.505,4.417l34.609-34.565l24.967,24.966
		l-34.578,34.534l4.44,9.525C197.403,370.751,190.952,407.138,167.171,430.877z M373.342,397.227l-7.564-31.645l31.646,7.564
		l49.498,49.499l-24.081,24.081L373.342,397.227z"
                  />
                </g>
              </svg>
              {!isCollapsed && (
                <>
                  <span className="mx-3 flex-1 text-left">Utilities</span>
                  <ChevronRightIcon
                    className={`h-4 w-4 transform transition-transform duration-200 ${
                      isUtilitiesOpen ? "rotate-90" : ""
                    }`}
                  />
                </>
              )}
            </button>

            {!isCollapsed && (
              <div
                className={`ml-8 overflow-hidden transition-all duration-300 ease-in-out ${
                  isUtilitiesOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <Link
                  to="/dashboard/utilities/json-formatter"
                  className="flex items-center mt-2 py-2 px-6 text-gray-700 dark:text-gray-200
                 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      strokeWidth="2"
                      d="M6 2.984V2h-.09c-.313 0-.616.062-.909.185a2.33 2.33 0 0 0-.775.53 2.23 2.23 0 0 0-.493.753v.001a3.542 3.542 0 0 0-.198.83v.002a6.08 6.08 0 0 0-.024.863c.012.29.018.58.018.869 0 .203-.04.393-.117.572v.001a1.504 1.504 0 0 1-.765.787 1.376 1.376 0 0 1-.558.115H2v.984h.09c.195 0 .38.04.556.121l.001.001c.178.078.329.184.455.318l.002.002c.13.13.233.285.307.465l.001.002c.078.18.117.368.117.566 0 .29-.006.58-.018.869-.012.296-.004.585.024.87v.001c.033.283.099.558.197.824v.001c.106.273.271.524.494.753.223.23.482.407.775.53.293.123.596.185.91.185H6v-.984h-.09c-.2 0-.387-.038-.563-.115a1.613 1.613 0 0 1-.457-.32 1.659 1.659 0 0 1-.309-.467c-.074-.18-.11-.37-.11-.573 0-.228.003-.453.011-.672.008-.228.008-.45 0-.665a4.639 4.639 0 0 0-.055-.64 2.682 2.682 0 0 0-.168-.609A2.284 2.284 0 0 0 3.522 8a2.284 2.284 0 0 0 .738-.955c.08-.192.135-.393.168-.602.033-.21.051-.423.055-.64.008-.22.008-.442 0-.666-.008-.224-.012-.45-.012-.678a1.47 1.47 0 0 1 .877-1.354 1.33 1.33 0 0 1 .563-.121H6zm4 10.032V14h.09c.313 0 .616-.062.909-.185.293-.123.552-.3.775-.53.223-.23.388-.48.493-.753v-.001c.1-.266.165-.543.198-.83v-.002c.028-.28.036-.567.024-.863-.012-.29-.018-.58-.018-.869 0-.203.04-.393.117-.572v-.001a1.502 1.502 0 0 1 .765-.787 1.38 1.38 0 0 1 .558-.115H14v-.984h-.09c-.196 0-.381-.04-.557-.121l-.001-.001a1.376 1.376 0 0 1-.455-.318l-.002-.002a1.415 1.415 0 0 1-.307-.465v-.002a1.405 1.405 0 0 1-.118-.566c0-.29.006-.58.018-.869a6.174 6.174 0 0 0-.024-.87v-.001a3.537 3.537 0 0 0-.197-.824v-.001a2.23 2.23 0 0 0-.494-.753 2.331 2.331 0 0 0-.775-.53 2.325 2.325 0 0 0-.91-.185H10v.984h.09c.2 0 .387.038.562.115.174.082.326.188.457.32.127.134.23.29.309.467.074.18.11.37.11.573 0 .228-.003.452-.011.672-.008.228-.008.45 0 .665.004.222.022.435.055.64.033.214.089.416.168.609a2.285 2.285 0 0 0 .738.955 2.285 2.285 0 0 0-.738.955 2.689 2.689 0 0 0-.168.602c-.033.21-.051.423-.055.64a9.15 9.15 0 0 0 0 .666c.008.224.012.45.012.678a1.471 1.471 0 0 1-.877 1.354 1.33 1.33 0 0 1-.563.121H10z"
                    />
                  </svg>
                  <span className="mx-3 text-nowrap">JSON Formatter</span>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/Utilities"
            className="flex items-center mt-4 py-2 px-6 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
          >
            {!isCollapsed && <span className="mx-3">Utilities</span>}
          </Link>

          <Link
            to="/dashboard/settings"
            className="flex items-center mt-4 py-2 px-6 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <Cog6ToothIcon className="h-6 w-6" />
            {!isCollapsed && <span className="mx-3">Settings</span>}
          </Link>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
