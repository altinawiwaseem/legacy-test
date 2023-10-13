import React from "react";
import Legend from "./Legend";

const Diagram = ({ data, groupedBy }) => {
  if (!data || data.length === 0) {
    return null; // No data to render
  }
  const dataArray = Array.isArray(data) ? data : [data];

  const colorData = [
    { color: "bg-gray-500", description: "Not Testable" },
    { color: "bg-red-500", description: "Fail" },
    { color: "bg-green-500", description: "Pass" },
  ];

  const getGroupHeader = (group) => {
    switch (groupedBy) {
      case "project":
        const uniqueProjects = [
          ...new Set(group.data.map((item) => item.project)),
        ];
        return `Project: ${uniqueProjects.join(", ")}`;
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
        return `Test Object: ${uniqueTestObject.join(", ")}`;
      case "market_variant":
        const uniqueMarketVariant = [
          ...new Set(group.data.map((item) => item.market_variant)),
        ];
        return `Market Variant: ${uniqueMarketVariant.join(", ")}`;
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
      <div className="m-2  p-2 flex flex-col items-center w-32 border-2 ">
        <div
          className={`box-content relative h-[200px] w-24 mx-4 ${
            item.stable ? "" : "border-dashed border-2 border-gray-500"
          }`}
        >
          <div
            className="flex flex-col-reverse"
            style={{ height: `${maxBarHeight}px` }}
          >
            <div
              style={{
                height: `${(resultsCount.pass / totalTests) * maxBarHeight}px`,
              }}
              className="bg-green-500"
            ></div>
            <div
              style={{
                height: `${(resultsCount.fail / totalTests) * maxBarHeight}px`,
              }}
              className="bg-red-500"
            ></div>
            <div
              style={{
                height: `${
                  (resultsCount.not_testable / totalTests) * maxBarHeight
                }px`,
              }}
              className="bg-gray-500"
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
              className="bg-gray-200"
            ></div>
          </div>
        </div>
        <table className="text-xs border border-gray-400 w-full">
          <tbody>
            <tr>
              <td className="px-4 py-1 border-b border-gray-400 font-semibold">
                {item.created_at.split("T")[0]}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-1 border-b border-gray-400 font-semibold">
                {item.build_number}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-1 border-b border-gray-400 font-semibold">
                {item.test_object}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-1 border-b border-gray-400 font-semibold">
                {item.market_variant}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-1 border-b border-gray-400 font-semibold">
                {item.project}
              </td>
            </tr>
            <tr>
              <td className="px-4 py-1 border-b border-gray-400 font-semibold">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 bg-gray-500`}></div>
                  <span>{resultsCount.not_testable}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-1 border-b border-gray-400 font-semibold">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 bg-red-500`}></div>
                  <span>{resultsCount.fail}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-1 border-b border-gray-400 font-semibold">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 bg-green-500`}></div>
                  <span>{resultsCount.pass}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-1 font-semibold">
                {item.stable ? "Stable" : "Not Stable"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4  ">
      {dataArray.map((group, groupIndex) => (
        <div
          key={`group-${groupIndex}`}
          className="flex flex-col items-center space-y-4 w-full"
        >
          <div className="text-xl font-bold">{getGroupHeader(group)}</div>
          <div className="flex flex-wrap  items-center p-4 border-2 border-gray-500 w-full">
            {group.data
              ? group.data.map((item, itemIndex) => (
                  <div key={`item-${itemIndex}`} className="m-2">
                    {renderDiagramBar(item)}
                  </div>
                ))
              : renderDiagramBar(group)}
          </div>
        </div>
      ))}
      <Legend colorData={colorData} />
    </div>
  );
};

export default Diagram;
