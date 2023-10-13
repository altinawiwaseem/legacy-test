import React, { useState, useEffect } from "react";
import axios from "axios";

function GetDataSteps() {
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BASE_URL + "/api/all"
        );
        if (response.status === 200) {
          const data = response.data;
          setSteps(data.data);
        } else {
          console.error("API request failed with status:", response.status);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    }

    fetchData();
  }, []);

  console.log("steps", steps);

  return (
    <div>
      <h1>Steps</h1>
      <ul>
        {steps && steps?.map((step) => <input value={step.step_details} />)}
      </ul>
    </div>
  );
}

export default GetDataSteps;
