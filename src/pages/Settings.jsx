import { useRef, useState } from "react";

const Settings = () => {
  const [selectedImage, setSelectedImage] = useState(
    "https://i.pravatar.cc/300",
  );
  const fileInputRef = useRef(null);

  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent default action
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0]; // selected file
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <main className="overflow-y-auto relative w-full  h-full rounded-md bg-gray-50 dark:bg-gray-900 lg:ml-0">
      <div className="grid grid-cols-2 gap-y-6 px-4 pt-6 dark:bg-gray-900 xl:grid-cols-2 xl:gap-4">
        <div className="col-span-full">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center">
              <li className="group flex items-center">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="mx-1 h-6 w-6 text-gray-400 group-first:hidden md:mx-2"
                  data-testid="flowbite-breadcrumb-separator"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                <a
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  data-testid="flowbite-breadcrumb-item"
                  href="#"
                >
                  <div className="flex items-center gap-x-3">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 20 20"
                      className="text-xl"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                    </svg>
                    <span className="dark:text-white">Home</span>
                  </div>
                </a>
              </li>
              <li className="group flex items-center">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="mx-1 h-6 w-6 text-gray-400 group-first:hidden md:mx-2"
                  data-testid="flowbite-breadcrumb-separator"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                <a
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  data-testid="flowbite-breadcrumb-item"
                  href="/users/list"
                >
                  Users
                </a>
              </li>
              <li className="group flex items-center">
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="0"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="mx-1 h-6 w-6 text-gray-400 group-first:hidden md:mx-2"
                  data-testid="flowbite-breadcrumb-separator"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
                <span
                  className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400"
                  data-testid="flowbite-breadcrumb-item"
                >
                  Settings
                </span>
              </li>
            </ol>
          </nav>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
            User settings
          </h1>
        </div>

        <div className="col-span-full xl:col-auto">
          <div className="grid grid-cols-1 gap-y-4">
            <div className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900 flex-col">
              <div className="flex h-full flex-col justify-center gap-4 p-6">
                <img
                  alt=""
                  src={selectedImage}
                  className="mb-4 h-28 w-28 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
                />
                <div>
                  <h3 className="mb-1 text-2xl font-bold text-gray-900 dark:text-white">
                    Jese Leos
                  </h3>
                  <div className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
                    Software Engineer
                  </div>
                  <button
                    onClick={handleButtonClick}
                    className="inline-flex items-center rounded-lg bg-primary-700 py-2 px-3 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 20 20"
                      className="mr-2"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z"></path>
                      <path d="M9 13h2v5a1 1 0 11-2 0v-5z"></path>
                    </svg>
                    Change picture
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Settings;
