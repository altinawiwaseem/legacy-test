import React, { useContext, useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmModal ";
import Diagram from "../Diagram/Diagram";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TestContext } from "../Context/TestContext/TestContext";

const TestSession = ({ data, user }) => {
  const [showModal, setShowModal] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [cancelSessionModal, setCancelSessionModal] = useState(false);
  const [stepIndexToDelete, setStepIndexToDelete] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);
  const [shouldCheckForEmptyFields, setShouldCheckForEmptyFields] =
    useState(false);

  const [activeTab, setActiveTab] = useState("table");

  const initialData = localStorage.getItem("testSteps")
    ? JSON.parse(localStorage.getItem("testSteps"))
    : data;

  const { displayTestData } = useContext(TestContext);

  /*  const DisplayTestData = localStorage.getItem("displayTestData")
    ? JSON.parse(localStorage.getItem("displayTestData"))
    : data;
 */
  const [editedData, setEditedData] = useState(initialData);

  const navigate = useNavigate();

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
      const editedBy = `${user?.firstName} ${user?.lastName}`;
      const updatedData = { ...prevData, edited_by: editedBy };
      console.log(updatedData);

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
      if (shouldCheckForEmptyFields) {
        const newEmptyFields = computeEmptyFields(updatedData);
        setEmptyFields(newEmptyFields);
      }

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
      setShouldCheckForEmptyFields(true);
    } else {
      // Submit the form
      updateTestSession(editedData._id, editedData);
      setShouldCheckForEmptyFields(false);
      console.log("Form submitted!");
    }
  };

  const updateTestSession = async (sessionId, updatedData) => {
    console.log("first", updatedData);
    try {
      const response = await axios.put(
        process.env.REACT_APP_BASE_URL + `/api/updateSession`,
        {
          id: sessionId,
          ...updatedData,
        }
      );

      if (response.status === 201) {
        navigate("/");
        localStorage.removeItem("sessionId");

        localStorage.removeItem("testSteps");
      }
    } catch (error) {
      console.error("Error updating the session:", error);
      throw error;
    }
  };

  const deleteTestSession = async (sessionId) => {
    try {
      console.log("sessionId", sessionId);
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + `/api/deleteSession`,
        {
          id: sessionId,
        }
      );

      if (response.status === 200) {
        navigate("/");
        localStorage.removeItem("sessionId");

        localStorage.removeItem("testSteps");
      }
    } catch (error) {
      console.error("Error deleting the session:", error);
      throw error;
    }
  };

  const handleCancelSession = () => {
    setCancelSessionModal(true);
  };

  const confirmSubmit = () => {
    // Close the modal
    setSubmitModal(false);
    updateTestSession(editedData._id, editedData);
  };

  const confirmSessionDelete = () => {
    deleteTestSession(editedData._id);
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
    setCancelSessionModal(false);
  };
  const createTestSession = () => {
    navigate("/");
  };

  if (!initialData || initialData.length === 0) {
    return (
      <div>
        <p>NO TEST SESSION AVAILABLE</p>
        <button className="btn" onClick={createTestSession}>
          Create Test Session
        </button>
      </div>
    );
  }

  return (
    <>
      <div>
        <div>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-300 w-full">
                <th className="border border-gray-300 px-4 py-2 w-1/4">
                  Tester
                </th>
                <th className="border border-gray-300 px-4 py-2 w-1/4">
                  Edited By
                </th>
                <th className="border border-gray-300 px-4 py-2 w-1/4">Date</th>
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
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {editedData.username}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">{`${user?.firstName} ${user?.lastName}`}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <input
                    type="date"
                    value={
                      editedData?.created_at &&
                      new Date(editedData?.created_at)
                        ?.toISOString()
                        ?.slice(0, 10)
                    }
                    onChange={(e) => handleEdit("created_at", e.target.value)}
                    className={`w-full px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500 text-center  
                    ${
                      emptyFields.includes(`created_at`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  <select
                    value={editedData?.stable}
                    onChange={(e) =>
                      handleEdit("stable", e.target.value === "true")
                    }
                    className={`w-full px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500 text-center  
                    ${
                      emptyFields.includes(`stable`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={editedData?.build_number}
                    onChange={(e) => handleEdit("build_number", e.target.value)}
                    className={`w-full px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500 text-center  
                    ${
                      emptyFields.includes(`build_number`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  />
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
                  <select
                    type="text"
                    value={editedData?.market_variant}
                    onChange={(e) =>
                      handleEdit("market_variant", e.target.value)
                    }
                    className={`w-full px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500 text-center  
                    ${
                      emptyFields.includes(`market_variant`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">Select a Variant</option>
                    <option value="EU">EU</option>
                    <option value="EU_SMALL">EU Small</option>
                    <option value="JP">JP</option>
                    <option value="JP_SMALL">JP Small</option>
                    <option value="KOR">KOR</option>
                    <option value="MRM">MRM</option>
                    <option value="NAR">NAR</option>
                    <option value="CT">CT</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    type="text"
                    value={editedData?.project}
                    onChange={(e) => handleEdit("project", e.target.value)}
                    className={`w-full px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500 text-center  
                    ${
                      emptyFields.includes(`project`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  >
                    {" "}
                    <option value="">Select a Project</option>
                    <option value="F380">F380</option>
                    <option value="F307">F307</option>
                    <option value="F386">F386</option>
                    <option value="F61">F61</option>
                  </select>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="text"
                    value={editedData?.screen_size}
                    onChange={(e) => handleEdit("screen_size", e.target.value)}
                    className={`w-full px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500 text-center  
                    ${
                      emptyFields.includes(`screen_size`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <select
                    type="text"
                    value={editedData?.test_object}
                    onChange={(e) => handleEdit("test_object", e.target.value)}
                    className={`w-full px-2 py-1 border border-gray-300 focus:outline-none focus:border-blue-500 text-center  
                    ${
                      emptyFields.includes(`test_object`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">Select a Target</option>
                    <option value="SIMULATOR">Simulator</option>
                    <option value="REMOTE_TARGET">Remote Target</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-center space-x-4 py-4 ">
          <div className=" w-96 bg-gray-500 my-2  flex justify-center rounded-md space-x-4 py-4">
            <button
              className={`w-32  ${
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
        <div>
          <table>
            <thead>
              <tr>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="w-screen">
                  <textarea
                    value={editedData?.notes}
                    onChange={(e) => handleEdit("notes", e.target.value)}
                    className="border-2 w-full h-32 resize-none"
                    name="note"
                    id=""
                  ></textarea>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {activeTab === "table" && (
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
                <th className="px-2 py-2 border border-gray-300">&#x2716;</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {editedData?.steps
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
                       ${
                         emptyFields.includes(`step_details_${index}`)
                           ? "border-2 border-red-500"
                           : ""
                       }`}
                    >
                      <input
                        type="text"
                        value={step.step_details}
                        onChange={(e) =>
                          handleEdit("step_details", e.target.value, index)
                        }
                        className="w-full border-0 focus:ring-0 focus:outline-none"
                      />
                    </td>
                    <td
                      className={`px-4 py-2 border border-gray-300 
                     ${
                       emptyFields.includes(`expected_results_${index}`)
                         ? "border-2 border-red-500"
                         : ""
                     }`}
                    >
                      <input
                        type="text"
                        value={step.expected_results}
                        onChange={(e) =>
                          handleEdit("expected_results", e.target.value, index)
                        }
                        className="w-full border-0 focus:ring-0 focus:outline-none"
                      />
                    </td>
                    <td
                      className={`px-4 py-2 border border-gray-300 
                      ${
                        emptyFields.includes(`actual_result_${index}`)
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                    >
                      <input
                        type="text"
                        value={step.actual_result}
                        onChange={(e) =>
                          handleEdit("actual_result", e.target.value, index)
                        }
                        className="w-full border-0 focus:ring-0 focus:outline-none"
                      />
                    </td>
                    <td
                      className={`px-4 py-2 border border-gray-300 
                        ${
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
          onClick={handleCancelSession}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Delete
        </button>
      </div>

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

      {cancelSessionModal && (
        <ConfirmModal
          message="Are you sure you want to delete the test session?"
          onConfirm={confirmSessionDelete}
          onCancel={cancelModal}
        />
      )}
    </>
  );
};

export default TestSession;
