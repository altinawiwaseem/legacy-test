import React, { useCallback, useContext } from "react";
import Legend from "../Legend/Legend";
import "./Diagram.css";
import { ThemeContext } from "../Context/ThemeContext/ThemeContext";

const Diagram = ({ data, groupedBy, onBarClick }) => {
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

  const renderDiagramBar = (item) => {
    const resultsCount = item.steps.reduce(
      (totals, step) => {
        totals[step.result.toLowerCase()]++;
        return totals;
      },
      { pass: 0, fail: 0, not_testable: 0 }
    );

    const totalTests = item.steps.length;
    const maxBarHeight = 200;

    return (
      <div className="diagram-container" onClick={() => handleBarClick(item)}>
        <div
          className={`diagram-box ${
            item.stable ? "diagram-stable" : "diagram-unstable"
          }`}
        >
          <div
            className="diagram-flex-container"
            style={{ height: `${maxBarHeight}px` }}
          >
            <div
              style={{
                height: `${(resultsCount.pass / totalTests) * maxBarHeight}px`,
              }}
              className="diagram-pass-color"
            ></div>
            <div
              style={{
                height: `${(resultsCount.fail / totalTests) * maxBarHeight}px`,
              }}
              className="diagram-fail-color"
            ></div>
            <div
              style={{
                height: `${
                  (resultsCount.not_testable / totalTests) * maxBarHeight
                }px`,
              }}
              className="diagram-not-testable-color"
            ></div>
            <div
              style={{
                height: `${
                  ((totalTests -
                    resultsCount.pass -
                    resultsCount.fail -
                    resultsCount.not_testable) /
                    totalTests) *
                  maxBarHeight
                }px`,
              }}
              className="diagram-gray-color"
            ></div>
          </div>
        </div>
        <table className={`diagram-table ${theme}`}>
          <tbody>
            <tr>
              <td className="diagram-td">{item.created_at.split("T")[0]}</td>
            </tr>
            <tr>
              <td className="diagram-td">{item.build_number}</td>
            </tr>
            <tr>
              <td className="diagram-td">
                {item.test_object === "REMOTE_TARGET"
                  ? "REMOTE TARGET"
                  : item.test_object}
              </td>
            </tr>
            <tr>
              <td className="diagram-td">{item.market_variant}</td>
            </tr>
            <tr>
              <td className="diagram-td">{item.project}</td>
            </tr>
            <tr>
              <td className="diagram-td">
                <div className="diagram-square">
                  <div className="diagram-not-testable-color diagram-square-inner"></div>
                  <span>{resultsCount.not_testable}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="diagram-td">
                <div className="diagram-square">
                  <div className="diagram-fail-color diagram-square-inner"></div>
                  <span>{resultsCount.fail}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="diagram-td">
                <div className="diagram-square">
                  <div className="diagram-pass-color diagram-square-inner"></div>
                  <span>{resultsCount.pass}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="diagram-td">
                {item.stable ? "Stable" : "Not Stable"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="diagrams-group-container  ">
      {dataArray.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="diagram-groups ">
          <div className={`group-text  `}>{getGroupHeader(group)}</div>
          <div className={` diagrams-group  `}>
            {group.data
              ? group.data.map((item, itemIndex) => (
                  <div key={`item-${itemIndex}`} className="diagram-bar">
                    {renderDiagramBar(item)}
                  </div>
                ))
              : renderDiagramBar(group)}
          </div>
        </div>
      ))}
      <Legend />
    </div>
  );
};

export default Diagram;
