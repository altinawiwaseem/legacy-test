import React, { useContext, useEffect } from "react";

import { AiOutlineEdit } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { TestContext } from "../Context/TestContext/TestContext";

import ExportToExcel from "../ExportToExcel/ExportToExcel";
import ImageModal from "../ImageModal/ImageModal";
import "./DisplayTestModal.css";
import { ThemeContext } from "../Context/ThemeContext/ThemeContext";

const DisplayTestModal = ({ isOpen, data, onClose, onEdit }) => {
  const { theme } = useContext(ThemeContext);
  const { handleImage, openModal, closeModal, isModalOpen, selectedImage } =
    useContext(TestContext);

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  useEffect(() => {
    //closing the modal by pressing the Escape key
    const closeOnEscapeKeyDown = (e) => {
      if ((e.charCode || e.keyCode) === 27) {
        onClose();
      }
    };

    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, [onClose]);

  if (!isOpen) return null;
  return (
    <div id="modal-overlay" onClick={handleOutsideClick}>
      <div id="pdf-content" className={`${theme}`}>
        <table className="table table-5">
          <thead>
            <tr className="">
              <th>Tester</th>
              <th>Edited By</th>
              <th>Date</th>
              <th>Stable</th>
              <th>Build Number</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{data?.username}</td>
              <td>{data?.edited_by}</td>
              <td>
                {data?.created_at &&
                  new Date(data?.created_at)?.toISOString()?.slice(0, 10)}
              </td>
              <td>{data?.stable ? "True" : "False"}</td>
              <td>{data.build_number}</td>
            </tr>
          </tbody>
        </table>

        <table className="table table-4">
          <thead className="table-4">
            <tr>
              <th>Market Variant</th>
              <th>Project</th>
              <th>Screen Size</th>
              <th>Test Object</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>{data?.market_variant}</td>
              <td>{data?.project}</td>
              <td>{data.screen_size}</td>
              <td>{data.test_object}</td>
            </tr>
          </tbody>
        </table>

        {data?.notes && (
          <div className=" note-container">
            <h2>Notes</h2>
            <div className="note">{data?.notes}</div>
          </div>
        )}

        <table className="table data-table">
          <thead>
            <tr>
              <th>No.</th>

              <th>Test Case ID</th>
              <th>Step Details</th>
              <th>Expected Results</th>
              <th>Actual Result</th>
              <th>Result</th>
              <th>Pic</th>
            </tr>
          </thead>
          <tbody>
            {data?.steps
              ?.sort((a, b) => a.step_id - b.step_id)
              .map((step, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{step.step_id}</td>
                  <td>{step.step_details}</td>
                  <td>{step.expected_results}</td>
                  <td>{step.actual_result}</td>
                  <td className={` diagram-${step.result.toLowerCase()}-color`}>
                    {step.result === "Not_Testable"
                      ? "Not Testable"
                      : step.result}
                  </td>

                  <td onClick={() => openModal(step?.imageId)}>
                    <img
                      src={handleImage(
                        step?.thumbnail,
                        step?.thumbnailContentType
                      )}
                      alt={step?.image_name}
                      style={{ maxWidth: "64px", cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <ImageModal imageId={selectedImage} onClose={closeModal} />
      )}
      <div className=" icon-container">
        <button className="icon" style={{ color: "green" }} onClick={onEdit}>
          <AiOutlineEdit />
        </button>

        <button className="icon" style={{ color: "red" }} onClick={onClose}>
          <AiOutlineClose />
        </button>

        <ExportToExcel data={data} />
      </div>
    </div>
  );
};

export default DisplayTestModal;
