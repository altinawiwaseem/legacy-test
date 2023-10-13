import React, { useState } from "react";
import axios from "axios";
import Diagram from "../Diagram/Diagram";

const FetchSessionData = () => {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [data, setData] = useState([]);
  console.log(data);
  const fetchData = async () => {
    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + "/api/search",
        {
          dateRange,
          selectedProjects,
        }
      );
      setData(response.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  return (
    <div>
      {/* Date range picker inputs */}
      Start Date:{" "}
      <input
        type="date"
        value={dateRange.startDate}
        onChange={(e) =>
          setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
        }
      />
      End Date:{" "}
      <input
        type="date"
        value={dateRange.endDate}
        onChange={(e) =>
          setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
        }
      />
      {/* Project selection */}
      <div>
        Projects:
        {["F380", "F307", "F386", "F61"].map((project) => (
          <label key={project}>
            <input
              type="checkbox"
              value={project}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedProjects((prev) => [...prev, e.target.value]);
                } else {
                  setSelectedProjects((prev) =>
                    prev.filter((p) => p !== e.target.value)
                  );
                }
              }}
            />
            {project}
          </label>
        ))}
      </div>
      <button onClick={fetchData}>Fetch Data</button>
      {/* Display the fetched data */}
      <div>
        <Diagram data={data} />
      </div>
    </div>
  );
};

export default FetchSessionData;
