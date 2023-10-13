import React from "react";
import Legend from "./Legend";

const Diagram = ({ data }) => {
  if (data.length === 0) {
    return null; // Don't render anything
  }
  const dataArray = Array.isArray(data) ? data : [data];

  const colorData = [
    { color: "bg-gray-500", description: "Not Testable" },
    { color: "bg-red-500", description: "Fail" },
    { color: "bg-green-500", description: "Pass" },
  ];

  return (
    data && (
      <div className="flex flex-col items-center  p-4 border-2 border-gray-500">
        {dataArray.map((data, index) => {
          const maxBarHeight = 200; // Maximum height for the bars.

          const resultsCount = data.steps.reduce(
            (totals, step) => {
              totals[step.result.toLowerCase()]++;
              return totals;
            },
            { pass: 0, fail: 0, not_testable: 0 }
          );

          const totalTests = data.steps.length; // Total number of cases

          return (
            <div
              key={index}
              className={`mx-4 p-2 flex flex-col items-center w-32`}
            >
              <div
                className={`box-content relative h-[200px] w-24 mx-4  ${
                  data.stable ? "" : "border-dashed border-2 border-gray-500"
                } `}
              >
                <div
                  className="flex flex-col-reverse"
                  style={{ height: `${maxBarHeight}px` }}
                >
                  <div
                    style={{
                      height: `${
                        (resultsCount.pass / totalTests) * maxBarHeight
                      }px`,
                    }}
                    className="bg-green-500"
                  ></div>
                  <div
                    style={{
                      height: `${
                        (resultsCount.fail / totalTests) * maxBarHeight
                      }px`,
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

              <table className=" text-xs border border-gray-400 w-full ">
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-400 font-semibold">
                      {data.created_at.split("T")[0]}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-400 font-semibold">
                      {data.build_number}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-400 font-semibold">
                      {data.test_object}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-400 font-semibold">
                      {data.market_variant}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-400 font-semibold">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 bg-gray-500`}></div>
                        <span>{resultsCount.not_testable}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-400 font-semibold">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 bg-red-500`}></div>
                        <span>{resultsCount.fail}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border-b border-gray-400 font-semibold">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 bg-green-500`}></div>
                        <span>{resultsCount.pass}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-semibold">
                      {data.stable ? "Stable" : "Not Stable"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}

        <Legend colorData={colorData} />
      </div>
    )
  );
};

export default Diagram;
