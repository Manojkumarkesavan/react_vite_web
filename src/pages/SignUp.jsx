import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../Service/UserService.jsx";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "USER",
    newsLetter: false, // Assuming this is for a newsletter checkbox
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => {
      if (name === "adminAccess") {
        setIsAdmin(checked);
        return {
          ...prevData,
          role: checked ? "ADMIN" : "USER",
        };
      }

      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  };

  const Toast = ({ message, onClose, duration = 3000 }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      setVisible(true); // Slide in

      const timer = setTimeout(() => {
        setVisible(false); // Slide out
        setTimeout(onClose, 300); // Allow time for slide-out transition
      }, duration);

      return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
      <div
        className={`fixed top-5 right-5 bg-green-500 text-white p-4 rounded shadow-lg transition-transform duration-300 ease-in-out transform ${
          visible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center">
          <span>{message}</span>
          <button onClick={onClose} className="ml-4">
            ✖️
          </button>
        </div>
      </div>
    );
  };

  const [toast, setToast] = useState({ show: false, message: "" });

  const closeToast = () => setToast({ show: false, message: "" });
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await UserService.register(formData, token);
      console.log(response);
      if (response.status === 200) {
        setToast({
          show: true,
          message: "Registration Successful..!!",
        });
        navigate("/login");
      } else if (response.status === 409) {
        setToast({
          show: true,
          message: "User already exists.",
        });
      } else {
        setToast({
          show: true,
          message: `Error: ${response.statusText}`,
        });
      }
    } catch (error) {
      console.error(error);

      if (error.response) {
        if (error.response.status === 409) {
          setToast({
            show: true,
            message: "User already exists.",
          });
        } else {
          setToast({
            show: true,
            message: `Registration failed with status: ${error.response.status}`,
          });
        }
      } else if (error.request) {
        setToast({
          show: true,
          message: "No response from server. Please try again later.",
        });
      } else {
        setToast({
          show: true,
          message: "An unexpected error occurred.",
        });
      }
    }
  };

  const handleLoginClick = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <section className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="flex justify-between w-full max-w-2xl">
          {" "}
          {/* Increased max-width */}
          <a
            href="#"
            className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img
              className="w-8 h-8 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            Flowbite
          </a>
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="adminAccess"
              name="adminAccess"
              checked={isAdmin}
              onChange={handleChange}
              className="hidden"
            />
            <label
              htmlFor="adminAccess"
              className="flex items-center cursor-pointer"
            >
              <span
                className={`relative inline-block w-10 h-6 transition duration-200 ease-linear rounded-full opacity-50 ${
                  isAdmin ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute left-0 inline-block w-6 h-6 transition-transform duration-200 ease-linear transform bg-white rounded-full shadow opacity-50 ${
                    isAdmin ? "translate-x-full" : "translate-x-0"
                  }`}
                />
              </span>
            </label>
          </div>
        </div>

        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-2xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div className="flex flex-wrap gap-4">
                {" "}
                {/* Flex container for inputs */}
                <div className="flex-1">
                  <label
                    htmlFor="firstName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                    placeholder="John"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="lastName"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mb-2"
                    placeholder="Parker"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="newsLetter"
                      name="newsLetter"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      checked={formData.newsLetter}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="newsLetter"
                      className="text-gray-500 dark:text-gray-300"
                    >
                      Subscribe to newsletter
                    </label>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                onClick={handleSubmit}
              >
                Sign Up
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don’t have an account yet?{" "}
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  onClick={handleLoginClick}
                >
                  Login In
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
      {toast.show && <Toast message={toast.message} onClose={closeToast} />}
    </section>
  );
};

export default SignUp;
