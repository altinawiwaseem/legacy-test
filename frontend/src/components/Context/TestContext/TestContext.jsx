import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TestContext = createContext(null);

const TestContextProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const navigate = useNavigate();

  const getUser = JSON.parse(localStorage.getItem("user"));

  // Get test steps from localStorage

  const getTestStepsFromLocalStorage = () => {
    const testSteps = localStorage.getItem("testSteps");
    if (testSteps) {
      return JSON.parse(localStorage.getItem("testSteps"));
    } else {
      return [];
    }
  };
  const [stepsData, setStepsData] = useState(getTestStepsFromLocalStorage());

  useEffect(() => {
    getTestStepsFromLocalStorage();
  }, []);

  // Get the Session ID from localStorage
  const getSessionIdFromLocalStorage = () => {
    const sessionId = localStorage.getItem("sessionId");
    if (sessionId) {
      return JSON.parse(localStorage.getItem("sessionId"));
    } else {
      return "";
    }
  };
  const [sessionId, setSessionId] = useState(getSessionIdFromLocalStorage());

  const [displayTestData, setDisplayTestData] = useState([]);

  const getISOWeekNumber = (date) => {
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);
    target.setDate(target.getDate() + 3 - ((target.getDay() + 6) % 7));
    const week1 = new Date(target.getFullYear(), 0, 4);
    return (
      1 +
      Math.round(
        ((target.getTime() - week1.getTime()) / 86400000 -
          3 +
          ((week1.getDay() + 6) % 7)) /
          7
      )
    );
  };

  const handleNewTest = (
    market_variant,
    screen_size,
    test_object,
    project,
    build_number
  ) => {
    localStorage.removeItem("quizQuestions");
    localStorage.removeItem("sessionId");
    localStorage.removeItem("answers");

    setSessionId("");
    setStepsData([]);

    handleCreateNewSession(
      market_variant,
      screen_size,
      test_object,
      project,
      build_number
    );
  };
  /* creating a new test session,  get the steps from db */

  const handleCreateNewSession = async (formData, token) => {
    const { market_variant, screen_size, test_object, project, build_number } =
      formData;
    try {
      const today = new Date();
      const kw = getISOWeekNumber(today);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/createtestsession`,
        {
          username: getUser.firstName + " " + getUser.lastName,
          user: getUser._id,
          kw: kw,
          market_variant: market_variant,
          screen_size: screen_size,
          test_object: test_object,
          project: project,
          build_number: build_number,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Set the response data in local storage
      localStorage.setItem(
        "testSteps",
        JSON.stringify(response.data.newTestSession)
      );
      localStorage.setItem(
        "sessionId",
        JSON.stringify(response.data.newTestSession._id)
      );

      console.log(response.data.newTestSession);
      // Update state variables as needed

      setStepsData(response.data.newTestSession);
      setSessionId(response.data.newTestSession._id);
      navigate("/testsession");
    } catch (error) {
      console.log(error);
    }
  };

  const handleImage = (thumbnailData, thumbnailContentType) => {
    if (thumbnailData && thumbnailData.length > 0 && thumbnailContentType) {
      const data = new Uint8Array(thumbnailData);
      const blob = new Blob([data], { type: thumbnailContentType });
      const url = URL.createObjectURL(blob);
      return url;
    }
    return null;
  };

  const openModal = async (imageId) => {
    setSelectedImage(imageId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage("");
    setIsModalOpen(false);
  };

  return (
    <TestContext.Provider
      value={{
        handleNewTest,
        sessionId,
        setSessionId,
        getSessionIdFromLocalStorage,
        getTestStepsFromLocalStorage,
        handleCreateNewSession,
        stepsData,
        setStepsData,
        setDisplayTestData,
        displayTestData,

        handleImage,
        openModal,
        closeModal,
        selectedImage,
        isModalOpen,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export { TestContext, TestContextProvider };
