import React, { useState, useEffect } from "react";
import axios from "axios";
import Diagram from "../Diagram/Diagram";

const FetchSessionData = () => {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [data, setData] = useState([]);
  const [fetchAll, setFetchAll] = useState(false);

  const [grouping, setGrouping] = useState("none");
  const [originalData, setOriginalData] = useState([]);

  const fetchData = async () => {
    console.log("first");
    try {
      const response = await axios.post(
        process.env.REACT_APP_BASE_URL + "/api/search",
        {
          dateRange,
          selectedProjects,
          fetchAll,
        }
      );
      const fetchedData = response.data;
      setOriginalData(fetchedData); // Save the fetched data
      groupData(fetchedData, grouping); // Group the fetched data
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  const groupData = (dataToGroup, groupKey) => {
    const groupedData = dataToGroup.reduce((acc, cur) => {
      const key = cur[groupKey];
      acc[key] = acc[key] || [];
      acc[key].push(cur);
      return acc;
    }, {});
    setData(
      Object.entries(groupedData).map(([key, value]) => ({
        key,
        data: value,
      }))
    );
  };
  useEffect(() => {
    groupData(originalData, grouping);
  }, [grouping, originalData]);

  return (
    <div className="m-4 p-4 bg-gray-100 rounded">
      <div className="flex space-x-4 mb-4">
        <span>Start Date:</span>
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
          }
          className="border p-2 rounded"
        />
        <span>End Date:</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) =>
            setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
          }
          className="border p-2 rounded"
        />
      </div>

      {/* Project selection */}
      <div className="flex flex-wrap items-center mb-4">
        <span className="mr-4">Projects:</span>
        {["F380", "F307", "F386", "F61"].map((project) => (
          <label key={project} className="flex items-center mr-4">
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
            <span className="ml-2">{project}</span>
          </label>
        ))}
      </div>

      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            onChange={(e) => setFetchAll(e.target.checked)}
          />
          <span className="ml-2">Fetch All</span>
        </label>
      </div>

      <button
        onClick={fetchData}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Fetch Data
      </button>

      <div className="mb-4">
        <label className="mr-2">Group by:</label>
        <select
          value={grouping}
          onChange={(e) => setGrouping(e.target.value)}
          className="border p-2"
        >
          <option value="none">None</option>
          <option value="project">Project</option>

          <option value="test_object">Test Object</option>
          <option value="market_variant">Market Variant</option>
          <option value="stable">Stability </option>
        </select>
      </div>
      <div>
        <Diagram data={data} groupedBy={grouping} />
      </div>
    </div>
  );
};

export default FetchSessionData;
