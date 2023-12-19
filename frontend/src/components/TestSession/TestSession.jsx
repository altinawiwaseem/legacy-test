import React, { useContext, useEffect, useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmModal ";
import Diagram from "../Diagram/Diagram";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TestContext } from "../Context/TestContext/TestContext";
import ImageModal from "../ImageModal/ImageModal";
import { ThemeContext } from "../Context/ThemeContext/ThemeContext";
import "../../styles/styles.css";
import "./TestSession.css";

const TestSession = ({ data, user }) => {
  const { handleImage, openModal, closeModal, isModalOpen, selectedImage } =
    useContext(TestContext);
  const { theme } = useContext(ThemeContext);
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
  const [weekNumber, setWeekNumber] = useState("");
  const [editedData, setEditedData] = useState(initialData);
  const navigate = useNavigate();

  const handleImageUpload = async (file, stepIndex, imageId) => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("imageId", imageId);

    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + "/api/upload-image",
        formData,

        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedTestSteps = [...initialData.steps];
      updatedTestSteps[stepIndex].imageId = response.data.imageId;
      updatedTestSteps[stepIndex].thumbnail = response.data.thumbnail.data;
      updatedTestSteps[stepIndex].thumbnailContentType =
        response.data.thumbnailContentType;
      updatedTestSteps[stepIndex].image_name = response.data.imageName;

      const updatedData = {
        ...initialData,
        steps: updatedTestSteps,
      };

      localStorage.setItem("testSteps", JSON.stringify(updatedData));

      // Update the state with the new test step data
      setEditedData(updatedData);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

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
    console.log(field);
    console.log(value);

    setEditedData((prevData) => {
      const editedBy = `${user?.firstName} ${user?.lastName}`;
      const updatedData = { ...prevData, edited_by: editedBy, kw: weekNumber };

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

    const tdElements = document.querySelectorAll("td[data-name]");

    tdElements.forEach((td) => {
      if (empties.includes(td.getAttribute("data-name"))) {
        td.classList.add("empty-input");
        console.log("first");
      } else {
        td.classList.remove("empty-input");
      }
    });

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
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + `/api/deleteSession`,
        {
          id: sessionId,
        }
      );

      if (response.status === 204) {
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
    <div className={`${theme}`}>
      <div className={`${theme} testSession`}>
        <div className={`${theme}`}>
          <div>
            <table className="table padding no-border table-5 ">
              <thead>
                <tr className="">
                  <th>Tester</th>
                  <th>Edited By</th>
                  <th>Date</th>
                  <th>KW</th>
                  <th>Stable</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td className="padding">{editedData.username}</td>
                  <td className="padding">{`${user?.firstName} ${user?.lastName}`}</td>
                  <td data-name={`created_at`}>
                    <input
                      type="date"
                      value={
                        editedData?.created_at &&
                        new Date(editedData?.created_at)
                          ?.toISOString()
                          ?.slice(0, 10)
                      }
                      onChange={(e) => handleEdit("created_at", e.target.value)}
                      className={`
                    ${
                      emptyFields.includes(`created_at`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    />
                  </td>

                  <td data-name={`kw`}>
                    <input
                      name="kw"
                      type="text"
                      value={editedData?.kw}
                      onChange={(e) => handleEdit("kw", e.target.value)}
                      className={`
                    ${
                      emptyFields.includes(`kw`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    />
                  </td>
                  <td data-name={`stable`}>
                    <select
                      value={editedData?.stable}
                      onChange={(e) =>
                        handleEdit("stable", e.target.value === "true")
                      }
                      className={`
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
                  {/*  <td data-name={`build_number`}>
                    <input
                      name="build_number"
                      type="text"
                      value={editedData?.build_number}
                      onChange={(e) =>
                        handleEdit("build_number", e.target.value)
                      }
                      className={`
                    ${
                      emptyFields.includes(`build_number`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    />
                  </td> */}
                </tr>
              </tbody>
            </table>

            <table className="table table-5 padding no-border">
              <thead>
                <tr className="bg-gray-200">
                  <th>Build Number</th>
                  <th>Market Variant</th>
                  <th>Project</th>
                  <th>Screen Size</th>
                  <th>Test Object</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td data-name={`build_number`}>
                    <input
                      name="build_number"
                      type="text"
                      value={editedData?.build_number}
                      onChange={(e) =>
                        handleEdit("build_number", e.target.value)
                      }
                      className={`
                    ${
                      emptyFields.includes(`build_number`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    />
                  </td>
                  <td name={`market_variant`}>
                    <select
                      type="text"
                      value={editedData?.market_variant}
                      onChange={(e) =>
                        handleEdit("market_variant", e.target.value)
                      }
                      className={`
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
                  <td data-name={`project`}>
                    <select
                      type="text"
                      value={editedData?.project}
                      onChange={(e) => handleEdit("project", e.target.value)}
                      className={`
                    ${
                      emptyFields.includes(`project`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    >
                      {" "}
                      <option value="">Select a Project</option>
                      <option value="F380">F380</option>
                      <option value="F386">F386</option>
                      <option value="F61">F61</option>
                      <option value="F308">F308</option>
                      <option value="F309">F309</option>
                      <option value="F390">F390</option>
                      <option value="F307">F307</option>
                    </select>
                  </td>
                  <td data-name={`screen_size`}>
                    <input
                      name="screen_size"
                      type="text"
                      value={editedData?.screen_size}
                      onChange={(e) =>
                        handleEdit("screen_size", e.target.value)
                      }
                      className={`
                    ${
                      emptyFields.includes(`screen_size`)
                        ? "border-2 border-red-500"
                        : ""
                    }`}
                    />
                  </td>
                  <td data-name={`test_object`}>
                    <select
                      type="text"
                      value={editedData?.test_object}
                      onChange={(e) =>
                        handleEdit("test_object", e.target.value)
                      }
                      className={`
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
            <table className="table no-border padding test-table">
              <thead className="bg-gray-200">
                <tr>
                  <th>No.</th>

                  <th>Test Case ID</th>
                  <th>Step Details</th>
                  <th>Expected Results</th>
                  <th>Actual Result</th>
                  <th>Result</th>
                  <th>Pic</th>
                  <th>&#x2716;</th>
                </tr>
              </thead>
              <tbody className=".no-border ">
                {editedData?.steps
                  ?.sort((a, b) => a.step_id - b.step_id)
                  .map((step, index) => (
                    <tr key={index}>
                      <td className=" padding ">{index + 1}</td>
                      <td className={`padding`}>{step.step_id}</td>
                      <td data-name={`step_details_${index}`}>
                        <input
                          data-name="step_details"
                          type="text"
                          value={step.step_details}
                          onChange={(e) =>
                            handleEdit("step_details", e.target.value, index)
                          }
                          className="no-border-input w-full border-0 focus:ring-0 focus:outline-none"
                        />
                      </td>
                      <td
                        data-name={`expected_results_${index}`}
                        className={`px-4 py-2 border border-gray-300 
                     ${
                       emptyFields.includes(`expected_results_${index}`)
                         ? "border-2 border-red-500"
                         : ""
                     }`}
                      >
                        <input
                          data-name="expected_results"
                          type="text"
                          value={step.expected_results}
                          onChange={(e) =>
                            handleEdit(
                              "expected_results",
                              e.target.value,
                              index
                            )
                          }
                          className="w-full border-0 focus:ring-0 focus:outline-none"
                        />
                      </td>
                      <td
                        data-name={`actual_result_${index}`}
                        className={`px-4 py-2 border border-gray-300 
                      ${
                        emptyFields.includes(`actual_result_${index}`)
                          ? "border-2 border-red-500"
                          : ""
                      }`}
                      >
                        <input
                          data-name="actual_result"
                          type="text"
                          value={step.actual_result}
                          onChange={(e) =>
                            handleEdit("actual_result", e.target.value, index)
                          }
                          className="w-full border-0 focus:ring-0 focus:outline-none"
                        />
                      </td>
                      <td
                        data-name={`result_${index}`}
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

                      <td>
                        {step?.thumbnail && step?.thumbnail.length > 0 && (
                          <div
                            className="thumbnail"
                            onClick={() => openModal(step?.imageId)}
                          >
                            <img
                              src={handleImage(
                                step?.thumbnail,
                                step?.thumbnailContentType
                              )}
                              alt={step?.image_name}
                              style={{ maxWidth: "64px", cursor: "pointer" }}
                            />
                          </div>
                        )}

                        <input
                          className="w-16"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageUpload(
                              e.target.files[0],
                              index,
                              step?.imageId
                            )
                          }
                        />
                      </td>

                      <td>
                        <button
                          className="red-btn "
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

        {isModalOpen && (
          <ImageModal imageId={selectedImage} onClose={closeModal} />
        )}
      </div>
    </div>
  );
};

export default TestSession;
