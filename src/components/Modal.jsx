// Modal.js
import React, { useEffect } from "react";

const Modal = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  // Handle Esc key to close the modal
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onCancel} // Close modal on backdrop click
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm mx-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Modal Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2">
          <h3
            className="text-lg font-medium text-gray-900 dark:text-gray-100"
            id="modal-title"
          >
            {title}
          </h3>
        </div>

        {/* Modal Body */}
        <div className="px-4 py-4">
          <p className="text-gray-600 dark:text-gray-300">{message}</p>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end border-t border-gray-200 dark:border-gray-700 px-4 py-2">
          <button
            onClick={onCancel}
            className="mr-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
