import React, { useCallback, useContext, useRef, useEffect } from "react";
/* import Legend from "../Legend/Legend"; */
import { Chart as ChartJS } from "chart.js/auto";
/* import { Bar } from "react-chartjs-2"; */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

/* import "./Diagram.css"; */
import { ThemeContext } from "../Context/ThemeContext/ThemeContext";

const Diagram = ({ data, groupedBy, onBarClick }) => {
  const chartRef = useRef(null);
  const { theme } = useContext(ThemeContext);
  const handleBarClick = useCallback(
    (item) => {
      if (onBarClick) {
        onBarClick(item);
      }
    },
    [onBarClick]
  );

  if (!data || data.length === 0) {
    return null;
  }

  const dataArray = Array.isArray(data) ? data : [data];

  const getGroupHeader = (group) => {
    switch (groupedBy) {
      case "project":
        const uniqueProjects = [
          ...new Set(group.data.map((item) => item.project)),
        ];
        return `${uniqueProjects.join(", ")}`;
      case "stable":
        const hasTrue = group.data.some((item) => item.stable === true);

        if (hasTrue) {
          return "Stable";
        } else {
          return "Not Stable";
        }

      case "test_object":
        const uniqueTestObject = [
          ...new Set(group.data.map((item) => item.test_object)),
        ];
        return ` ${uniqueTestObject.join(", ")}`;
      case "market_variant":
        const uniqueMarketVariant = [
          ...new Set(group.data.map((item) => item.market_variant)),
        ];
        return ` ${uniqueMarketVariant.join(", ")}`;
      case "none":
        return "";
      default:
        return "";
    }
  };

  return (
    <div className="diagrams-group-container">
      {dataArray.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="diagram-groups">
          <div className={`group-text`}>{getGroupHeader(group)}</div>
          <div className={`diagrams-group`}>
            {group.data ? (
              <div key={`item-${groupIndex}`} className="diagram-bar">
                <DiagramBar
                  item={group}
                  theme={theme}
                  onBarClick={handleBarClick}
                />
              </div>
            ) : (
              <div key={`item-0`} className="diagram-bar">
                <DiagramBar
                  item={group}
                  theme={theme}
                  onBarClick={handleBarClick}
                />
              </div>
            )}
          </div>
        </div>
      ))}
      {/*  <Legend /> */}
    </div>
  );
};

const DiagramBar = ({ item, theme, onBarClick }) => {
  const handleBarClick = () => {
    if (onBarClick) {
      onBarClick(item);
    }
  };

  const data = item.data.map((dataItem, index) => {
    const resultsCount = dataItem.steps.reduce(
      (totals, step) => {
        totals[step.result.toLowerCase()]++;
        return totals;
      },
      { pass: 0, fail: 0, not_testable: 0 }
    );

    return {
      name: `Step ${index + 1}`,

      pass: resultsCount.pass,
      fail: resultsCount.fail,
      notTestable: resultsCount.not_testable,
    };
  });

  return (
    <div className="diagram-container" onClick={handleBarClick}>
      <div
        className={`diagram-box ${
          item.stable ? "diagram-stable" : "diagram-unstable"
        }`}
      >
        <div className="diagram-container">
          <BarChart width={1000} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />

            <YAxis type="number" domain={[0, 100]} />

            <Tooltip />
            <Legend />

            <Bar dataKey="pass" stackId="a" fill="green" />
            <Bar dataKey="fail" stackId="a" fill="red" />
            <Bar dataKey="notTestable" stackId="a" fill="grey" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Diagram;
