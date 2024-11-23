import React, { useState, useEffect } from "react";

const Toast = ({ message, type, onClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={`fixed top-5 right-5 ${getBackgroundColor()} text-white p-4 rounded shadow-lg transition-transform duration-300 ease-in-out transform ${
        visible ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4">✖️</button>
      </div>
    </div>
  );
};

export default Toast;
