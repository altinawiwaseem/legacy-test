import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TestContext = createContext(null);

const TestContextProvider = ({ children }) => {
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
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/createtestsession`,
        {
          username: getUser.firstName + " " + getUser.lastName,
          user: getUser._id,

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

  const getResultBackgroundColor = (result) => {
    switch (result) {
      case "Pass":
        return "green-500";
      case "Fail":
        return "red-500";
      case "Not_Testable":
        return "gray-400";
      default:
        return "bg-gray-200";
    }
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
        getResultBackgroundColor,
      }}
    >
      {children}
    </TestContext.Provider>
  );
};

export { TestContext, TestContextProvider };
