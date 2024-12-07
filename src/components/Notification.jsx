import { useEffect } from "react";

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    // Automatically close the notification after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clear the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
        <span className="text-2xl">🔔</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white focus:outline-none hover:text-gray-200"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Notification;
