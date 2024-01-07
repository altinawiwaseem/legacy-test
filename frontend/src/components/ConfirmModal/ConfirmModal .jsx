import React, { useContext } from "react";
import "./ConfirmModal.css";
import { ThemeContext } from "../Context/ThemeContext/ThemeContext";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`modal-container `}>
      <div className={`modal-overlay `}></div> {/* Background overlay */}
      <div className={`modal-box ${theme}`}>
        <p>{message}</p>
        <div className="modal-btn-box">
          <button onClick={onCancel} className="btn-cancel">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-confirm">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
