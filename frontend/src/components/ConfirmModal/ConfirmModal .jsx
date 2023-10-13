import React from "react";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50"></div>{" "}
      {/* Background overlay */}
      <div className="bg-white p-4 rounded shadow-md relative">
        <p>{message}</p>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 mr-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
