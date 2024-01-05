import { useState, useEffect, useContext } from "react";
import { RiDownload2Fill } from "react-icons/ri";
import "./TestsLog.css";
import axios from "axios";
import { ThemeContext } from "../Context/ThemeContext/ThemeContext";
import TestsLogResultTable from "./TestsLogResultTable";
import ExportToExcel from "../ExportToExcel/ExportToExcel";

const TestsLog = () => {
  const [logs, setLogs] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [tableData, setTableData] = useState("");
  const { theme } = useContext(ThemeContext);

  const handleItemClick = (index) => {
    setSelectedItem(index);
    setTableData(logs[index]);
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

  return (
    <div className={`comparison-log ${theme}`}>
      <div className={`logs ${theme}`}>
        {logs &&
          logs?.map((log, index) => (
            <div
              key={index}
              className={`log-item ${
                selectedItem === index ? "border-green" : ""
              }`}
              onClick={() => handleItemClick(index)}
            >
              <div>{`${index + 1}.`}</div>
              <div className="log-item-inner-div">
                <p>Type: {log.type.toUpperCase()}</p>
                <p>PRL: {log.prl.toUpperCase()}</p>
                <p>Screen Size: {log.screenSize}</p>
              </div>
              <div className="log-item-inner-div">
                <p>{new Date(log.date).toLocaleDateString("de-DE")}</p>

                <p>{new Date(log.date).toLocaleTimeString("de-DE")}</p>
                <RiDownload2Fill onClick={() => ExportToExcel(logs[index])} />
              </div>
            </div>
          ))}
      </div>
      {tableData && (
        <div className="result">
          <TestsLogResultTable tableData={tableData} />
        </div>
      )}
    </div>
  );
};

export default TestsLog;
