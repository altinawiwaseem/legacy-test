import React, { useContext, useEffect } from "react";

import { AiOutlineDownload, AiOutlineEdit } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import { TestContext } from "../Context/TestContext/TestContext";
/* import html2pdf from "html2pdf.js"; */
import jsPDF from "jspdf";
/* import { utils, writeFile } from "xlsx"; */
import * as XLSX from "xlsx";
import ExportToExcel from "../ExportToExcel/ExportToExcel";

const DisplayTestModal = ({ isOpen, data, onClose, onEdit }) => {
  const { getResultBackgroundColor } = useContext(TestContext);

  const handleOutsideClick = (e) => {
    if (e.target.id === "modal-overlay") {
      onClose();
    }
  };

  useEffect(() => {
    // This is to enable closing the modal by pressing the Escape key
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
    <div
      id="modal-overlay"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 "
      onClick={handleOutsideClick}
    >
      <div
        id="pdf-content"
        className="bg-white p-8 rounded-lg w-[90vw] h-[100vh]  overflow-auto"
      >
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-300 w-full">
              <th className="border border-gray-300 px-4 py-2 w-1/5">Tester</th>
              <th className="border border-gray-300 px-4 py-2 w-1/5">
                Edited By
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/5">Date</th>
              <th className="border border-gray-300 px-4 py-2 w-1/5">Stable</th>
              <th className="border border-gray-300 px-4 py-2 w-1/5">
                Build Number
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {data?.username}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {data?.edited_by}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {data?.created_at &&
                  new Date(data?.created_at)?.toISOString()?.slice(0, 10)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {data?.stable ? "True" : "False"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {data.build_number}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 w-1/4">
                Market Variant
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/4">
                Project
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/4">
                Screen Size
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/4">
                Test Object
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                {data?.market_variant}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {data?.project}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {data.screen_size}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {data.test_object}
              </td>
            </tr>
          </tbody>
        </table>

        {data?.notes && (
          <div className="my-2 flex flex-col items-center">
            <h2 className="font-bold">Notes</h2>
            <div
              className="w-full h-32 p-4 border-2"
              style={{ whiteSpace: "pre-line" }}
            >
              {data?.notes}
            </div>
          </div>
        )}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className=" border  border-gray-300">No.</th>

              <th className=" border  border-gray-300">Test Case ID</th>
              <th className={`px-4 py-2 border border-gray-300 `}>
                Step Details
              </th>
              <th className={`px-4 py-2 border border-gray-300 `}>
                Expected Results
              </th>
              <th className={`px-4 py-2 border border-gray-300 `}>
                Actual Result
              </th>
              <th className={`px-4 py-2 border border-gray-300 `}>Result</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.steps
              ?.sort((a, b) => a.step_id - b.step_id)
              .map((step, index) => (
                <tr key={index} className="hover:bg-gray-300">
                  <td className="w-2 px-4 py-2 border border-gray-300 ">
                    {index + 1}
                  </td>
                  <td className={`w-2 px-4 py-2 border border-gray-300 `}>
                    {step.step_id}
                  </td>
                  <td
                    className={`px-4 py-2 border border-gray-300 
                        `}
                  >
                    {step.step_details}
                  </td>
                  <td
                    className={`px-4 py-2 border border-gray-300 
                       `}
                  >
                    {step.expected_results}
                  </td>
                  <td
                    className={`px-4 py-2 border border-gray-300 
                        `}
                  >
                    {step.actual_result}
                  </td>
                  <td
                    className={`px-4 py-2 border border-gray-300 bg-${getResultBackgroundColor(
                      step.result
                    )} `}
                  >
                    {step.result === "Not_Testable"
                      ? "Not Testable"
                      : step.result}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-600 border-2 border-red-500 w-12 h-36 absolute top-36 right-0 flex flex-col items-center justify-center rounded-lg shadow-lg p-2">
        <button
          className="mb-2 bg-white text-2xl rounded-full p-1"
          style={{ color: "green" }}
          onClick={onEdit}
        >
          <AiOutlineEdit />
        </button>

        <button
          className="mt-2 bg-white text-2xl rounded-full p-1"
          style={{ color: "red" }}
          onClick={onClose}
        >
          <AiOutlineClose />
        </button>
        <ExportToExcel data={data} />
      </div>
    </div>
  );
};

export default DisplayTestModal;
