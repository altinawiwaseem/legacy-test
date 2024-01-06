import { useState, useEffect, useContext } from "react";
import { RiDownload2Fill } from "react-icons/ri";
import "./TestsLog.css";
import axios from "axios";
import { ThemeContext } from "../Context/ThemeContext/ThemeContext";

import ExportToExcel from "../ExportToExcel/ExportToExcel";
import DisplayTestModal from "../DisplayTestModal/DisplayTestModal";
import { TestContext } from "../Context/TestContext/TestContext";
import { useNavigate } from "react-router-dom";

const TestsLog = () => {
  const [logs, setLogs] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [tableData, setTableData] = useState("");
  const { theme } = useContext(ThemeContext);

  const { setDisplayTestData } = useContext(TestContext);
  const [testData, setTestData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = (index) => {
    setSelectedItem(index);
    console.log(logs[index]);
    setDisplayTestData(logs[index]);
    setTestData(logs[index]);
    setIsModalOpen(true);
  };

  const getLog = async () => {
    try {
      const fetchedLogs = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/log`
      );

      setLogs(fetchedLogs.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLog();
  }, []);

  const handleOpenModal = (data) => {
    setDisplayTestData(data);
    setTestData(data);
    setIsModalOpen(true);
  };
  const navigate = useNavigate();
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const handleEdit = () => {
    localStorage.setItem("testSteps", JSON.stringify(testData));
    setIsModalOpen(false);
    navigate("/testsession", { state: { data: testData } });
  };

  return (
    <div className={`comparison-log ${theme}`}>
      <div className={`logs ${theme}`}>
        {logs &&
          logs.map((log, index) => (
            <div
              key={index}
              className={`log-item ${
                selectedItem === index ? "border-green" : ""
              } ${log.stable === false ? "not-stable" : ""} `}
              onClick={() => handleItemClick(index)}
            >
              <div>{`${index + 1}.`}</div>
              <div className="inner-div">
                <div className="log-item-inner-div">
                  <p>{log.project}</p>
                  <p>{log.build_number}</p>
                  <p>{log.screen_size}</p>
                </div>
                <div className="log-item-inner-div">
                  <p>{new Date(log.created_at).toLocaleDateString("de-DE")}</p>
                  <p>{log.market_variant}</p>
                  <p>{log.stable === true ? "Stable" : "Not Stable"}</p>
                </div>
              </div>
            </div>
          ))}
      </div>

      {testData && (
        <div>
          <DisplayTestModal
            isOpen={isModalOpen}
            data={testData}
            onClose={handleCloseModal}
            onEdit={handleEdit}
          />
        </div>
      )}
    </div>
  );
};

export default TestsLog;
