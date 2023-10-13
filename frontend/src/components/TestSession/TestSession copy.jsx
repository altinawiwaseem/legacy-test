import React, { useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmModal ";
import Diagram from "../Diagram/Diagram";

const TestSession = ({ data, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [stepIndexToDelete, setStepIndexToDelete] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);
  const [activeTab, setActiveTab] = useState("table");
  const initialData = localStorage.getItem("testSteps")
    ? JSON.parse(localStorage.getItem("testSteps"))
    : data;

  const [editedData, setEditedData] = useState(initialData);

  const InputField = ({ value, onChange, emptyFields, field }) => (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={`w-full px-2 py-1 border ${
        emptyFields.includes(field) ? "border-red-500" : "border-gray-300"
      } focus:outline-none focus:border-blue-500 text-center`}
    />
  );

  const SelectField = ({ value, onChange, emptyFields, field }) => (
    <select
      value={value}
      onChange={onChange}
      className={`w-full px-2 py-1 border ${
        emptyFields.includes(field) ? "border-red-500" : "border-gray-300"
      } focus:outline-none focus:border-blue-500 text-center`}
    >
      <option value="true">True</option>
      <option value="false">False</option>
    </select>
  );

  const debounce = (func, delay) => {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  };

  const saveToLocalStorage = debounce((data) => {
    localStorage.setItem("testSteps", JSON.stringify(data));
  }, 300);

  const handleEdit = (field, value, stepIndex = null) => {
    setEditedData((prevData) => {
      const updatedData = { ...prevData };
      if (stepIndex !== null) {
        updatedData.steps = prevData.steps.map((step, index) => {
          if (index === stepIndex) {
            return {
              ...step,
              [field]: value,
            };
          }
          return step;
        });
      } else {
        updatedData[field] = value;
      }

      // Save to localStorage
      saveToLocalStorage(updatedData);

      // Recompute empty fields after editing
      const newEmptyFields = computeEmptyFields(updatedData);
      setEmptyFields(newEmptyFields);

      return updatedData;
    });
  };

  const computeEmptyFields = (data) => {
    let empties = [];

    // Check each input field for emptiness
    Object.keys(data).forEach((key) => {
      if (data[key] === null || data[key] === undefined || data[key] === "") {
        empties.push(key);
      }
    });
    data.steps.forEach((step, index) => {
      Object.keys(step).forEach((key) => {
        if (step[key] === null || step[key] === undefined || step[key] === "") {
          empties.push(`${key}_${index}`); // Unique key for each step input
        }
      });
    });
    return empties;
  };

  const handleSubmit = () => {
    const empties = computeEmptyFields(editedData);
    if (empties.length) {
      setEmptyFields(empties);
      setSubmitModal(true);
    } else {
      // Submit the form
      console.log("Form submitted!");
    }
  };

  const confirmSubmit = () => {
    // Close the modal
    setSubmitModal(false);
  };

  const handleDelete = (stepIndexToDelete) => {
    setShowModal(true);

    setStepIndexToDelete(stepIndexToDelete);
  };

  const confirmDelete = () => {
    const updatedSteps = editedData.steps.filter(
      (_, index) => index !== stepIndexToDelete
    );

    setEditedData((prevData) => {
      const updatedData = { ...prevData };
      updatedData.steps = updatedSteps;

      // Save to localStorage
      saveToLocalStorage(updatedData);
      const newEmptyFields = computeEmptyFields(updatedData);
      setEmptyFields(newEmptyFields);
      return updatedData;
    });

    // Close the modal
    setShowModal(false);
  };

  // Function to cancel the deletion
  const cancelModal = () => {
    // Close the modal
    setShowModal(false);
    setSubmitModal(false);
  };

  return (
    <>
      <div>
        <div>
          <div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200 w-full">
                  <th className="border border-gray-300 px-4 py-2 w-1/4">
                    Tester
                  </th>
                  <th className="border border-gray-300 px-4 py-2 w-1/4">
                    Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2 w-1/4">
                    Stable
                  </th>
                  <th className="border border-gray-300 px-4 py-2 w-1/4">
                    Build Number
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 text-center">{`${user?.firstName} ${user?.lastName}`}</td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <InputField
                      value={new Date(editedData?.created_at)
                        .toLocaleString("de-DE")
                        .slice(0, 10)}
                      onChange={(e) =>
                        handleEdit("test_object", e.target.value)
                      }
                      emptyFields={emptyFields}
                      field="created_at"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    <SelectField
                      value={editedData?.stable}
                      onChange={(e) =>
                        handleEdit("stable", e.target.value === "true")
                      }
                      emptyFields={emptyFields}
                      field="stable"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <InputField
                      value={editedData.build_number}
                      onChange={(e) =>
                        handleEdit("build_number", e.target.value)
                      }
                      emptyFields={emptyFields}
                      field="build_number"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center space-x-4 py-4">
          <div className="w-1/3 bg-gray-500 my-2 flex justify-center rounded-md space-x-4 py-4">
            <button
              className={`w-32 ${
                activeTab === "table"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-md`}
              onClick={() => setActiveTab("table")}
            >
              Table
            </button>
            <button
              className={`w-32 ${
                activeTab === "diagram"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-md`}
              onClick={() => setActiveTab("diagram")}
            >
              Diagram
            </button>
          </div>
        </div>

        {activeTab === "table" && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-200">
              <tr>
                <th className="border  border-gray-300">No.</th>
                <th className="border  border-gray-300">Test Case ID</th>
                <th className={`px-4 py-2 border border-gray-300`}>
                  Step Details
                </th>
                <th className={`px-4 py-2 border border-gray-300`}>
                  Expected Results
                </th>
                <th className={`px-4 py-2 border border-gray-300`}>
                  Actual Result
                </th>
                <th className={`px-4 py-2 border border-gray-300`}>Result</th>
                <th className="px-2 py-2 border border-gray-300">&#x2716;</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {editedData?.steps
                ?.sort((a, b) => a.step_number - b.step_number)
                .map((step, index) => (
                  <tr key={index} className="hover:bg-gray-300">
                    <td className="w-2 px-4 py-2 border border-gray-300 ">
                      {index + 1}
                    </td>
                    <td className={`w-2 px-4 py-2 border border-gray-300 `}>
                      {step.step_number}
                    </td>
                    <td
                      className={`px-4 py-2 border border-gray-300 ${
                        emptyFields.includes(`step_details_${index}`)
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                    >
                      <InputField
                        value={step.step_details}
                        onChange={(e) =>
                          handleEdit("step_details", e.target.value, index)
                        }
                        emptyFields={emptyFields}
                        field={`step_details_${index}`}
                      />
                    </td>
                    <td
                      className={`px-4 py-2 border border-gray-300 ${
                        emptyFields.includes(`expected_results_${index}`)
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                    >
                      <InputField
                        value={step.expected_results}
                        onChange={(e) =>
                          handleEdit("expected_results", e.target.value, index)
                        }
                        emptyFields={emptyFields}
                        field={`expected_results_${index}`}
                      />
                    </td>
                    <td
                      className={`px-4 py-2 border border-gray-300 ${
                        emptyFields.includes(`actual_result_${index}`)
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                    >
                      <InputField
                        value={step.actual_result}
                        onChange={(e) =>
                          handleEdit("actual_result", e.target.value, index)
                        }
                        emptyFields={emptyFields}
                        field={`actual_result_${index}`}
                      />
                    </td>
                    <td
                      className={`px-4 py-2 border border-gray-300 ${
                        emptyFields.includes(`result_${index}`)
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                    >
                      <select
                        name="result"
                        value={step.result}
                        onChange={(e) =>
                          handleEdit("result", e.target.value, index)
                        }
                        className="w-full border-0 focus:ring-0 focus:outline-none"
                      >
                        <option value="">Result</option>
                        <option value="Pass">Pass</option>
                        <option value="Fail">Fail</option>
                        <option value="Not_Testable">Not Testable</option>
                      </select>
                    </td>
                    <td
                      className={`px-2 py-2 border border-gray-300 flex justify-center items-center  `}
                    >
                      <button
                        className=" hover:bg-red-500"
                        onClick={() => handleDelete(index)}
                      >
                        &#x2716; {/* Red X mark */}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {showModal && (
          <ConfirmModal
            message="Are you sure you want to delete this step?"
            onConfirm={confirmDelete}
            onCancel={cancelModal}
          />
        )}

        {submitModal && (
          <ConfirmModal
            message="There are empty fields. Do you want to continue?"
            onConfirm={confirmSubmit}
            onCancel={cancelModal}
          />
        )}
      </div>
      {activeTab === "diagram" && (
        <div className="my-8">
          <Diagram data={editedData} />
        </div>
      )}
      <div className="flex justify-center space-x-12 my-4">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-4 py-2 rounded-md mr-2"
        >
          Submit
        </button>
        <button
          onClick={cancelModal}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export default TestSession;
