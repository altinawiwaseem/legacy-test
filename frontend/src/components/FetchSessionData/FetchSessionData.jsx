import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Diagram from "../Diagram/Diagram";
import Pagination from "../Pagination/Pagination";
import TestSession from "../TestSession/TestSession";
import DisplayTestModal from "../DisplayTestModal/DisplayTestModal";
import { TestContext } from "../Context/TestContext/TestContext";

const FetchSessionData = () => {
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [data, setData] = useState([]);
  const [fetchAll, setFetchAll] = useState(false);

  const [grouping, setGrouping] = useState("none");
  const [originalData, setOriginalData] = useState([]);
  const [pageData, setPageData] = useState("");

  const initialMount = useRef(true);

  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(50); // default value
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [testData, setTestData] = useState(null);

  const { setDisplayTestData } = useContext(TestContext);

  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const pageFromUrl = searchParams.get("page");

  if (isNaN(pageFromUrl)) {
    pageFromUrl = 1;
  }
  const [currentPage, setCurrentPage] = useState(
    pageFromUrl ? Number(pageFromUrl) : 1
  );

  const fetchData = async (page = currentPage) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/search`,
        {
          dateRange,
          selectedProjects,
          fetchAll,
          page,
          itemsPerPage,
        }
      );

      const totalCount = response.data.totalCount;
      const fetchedData = response.data.data;

      setOriginalData(fetchedData);
      groupData(fetchedData, grouping);
      setPageData(fetchedData);
      setTotalPages(Math.ceil(totalCount / itemsPerPage));
      setCurrentPage(page);
      navigate(`?page=${page}`);
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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && currentPage !== newPage) {
      fetchData(newPage);
    }
  };

  const previousPageFromUrl = useRef(pageFromUrl);

  useEffect(() => {
    if (initialMount.current && !pageFromUrl) {
      initialMount.current = false;
      return;
    }

    fetchData(parseInt(pageFromUrl) || 1);
  }, [pageFromUrl]);

  const handleBarClick = async (data) => {
    try {
      localStorage.setItem("displayTestData", JSON.stringify(data));
      handleOpenModal(data);
      /* navigate("/view-test-data"); */
    } catch (error) {
      console.error("Error handling click:", error);
    }
  };

  const handleOpenModal = (data) => {
    setDisplayTestData(data);
    setTestData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleEdit = () => {
    console.log("testdata", testData);
    localStorage.setItem("testSteps", JSON.stringify(testData));
    setIsModalOpen(false);
    navigate("/testsession", { state: { data: testData } });
  };

  return (
    <div className="m-4 p-4 bg-gray-100 rounded relative">
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
        onClick={() => fetchData(1)}
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
        <div className="mb-4">
          <label>Items per Page:</label>
          <input
            type="number"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
            className="border p-2"
          />
        </div>
      </div>
      {pageData && (
        <div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>
      )}
      <div>
        <Diagram
          data={data}
          groupedBy={grouping}
          onBarClick={handleOpenModal}
        />
      </div>
      {pageData && (
        <div>
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            handlePageChange={handlePageChange}
          />
        </div>
      )}

      <DisplayTestModal
        isOpen={isModalOpen}
        data={testData}
        onClose={handleCloseModal}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default FetchSessionData;
