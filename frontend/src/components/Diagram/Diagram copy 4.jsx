import React, { useCallback, useContext, useRef, useEffect } from "react";
import Legend from "../Legend/Legend";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

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
      <Legend />
    </div>
  );
};

const DiagramBar = ({ item, theme, onBarClick }) => {
  const handleBarClick = () => {
    if (onBarClick) {
      onBarClick(item);
    }
  };

  const totalTests = item.data.map((step) => step.steps.length);
  console.log(item.data);
  const data = item.data.map((dataItem) => {
    const resultsCount = dataItem.steps.reduce(
      (totals, step) => {
        totals[step.result.toLowerCase()]++;
        return totals;
      },
      { pass: 0, fail: 0, not_testable: 0 }
    );

    return {
      /* name: dataItem.created_at, */
      pass: resultsCount.pass,
      fail: resultsCount.fail,
      notTestable: resultsCount.not_testable,
      cases:
        totalTests[0] -
        (resultsCount.pass + resultsCount.fail + resultsCount.not_testable),
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
          <BarChart
            width={1000}
            height={300}
            barCategoryGap={10}
            maxBarSize={80}
            data={data}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis type="number" domain={[0, 100]} />
            {/*  <Tooltip /> */}
            {/* <Legend /> */}
            <Bar dataKey="pass" stackId="a" fill="green" />
            <Bar dataKey="fail" stackId="a" fill="red" />
            <Bar dataKey="notTestable" stackId="a" fill="grey" />
            <Bar dataKey="cases" stackId="a" fill="lightgray" />
          </BarChart>
        </div>
        <div className="data-table">
          <table className={`diagram-table ${theme}`}>
            <tbody>
              <tr>
                {item.data.map((el, i) => (
                  <td key={i} className="diagram-td">
                    {new Date(el.created_at).toLocaleDateString()}
                    <br />
                    {el.build_number}
                    <br />
                    {el.test_object === "REMOTE_TARGET"
                      ? "REMOTE TARGET"
                      : el.test_object}
                    <br />
                    {el.market_variant}
                    <br />
                    {el.project}
                    <br />
                    <div className="diagram-square">
                      <div className="diagram-not-testable-color diagram-square-inner"></div>
                    </div>
                    <br />
                    <div className="diagram-square">
                      <div className="diagram-fail-color diagram-square-inner"></div>
                    </div>
                    <br />
                    <div className="diagram-square">
                      <div className="diagram-pass-color diagram-square-inner"></div>
                    </div>
                    <br />
                    {el.stable ? "Stable" : "Not Stable"}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Diagram;

/* const customScale = {
  id: "customScale",
  beforeDatasetsDraw(chart, args, plugins) {
    const {
      ctx,
      chartArea: { width, height, left, right, top, bottom },
      data,
      scales: { x, y },
    } = chart;

    const dataPointLength = data.labels.length;

    const segment = width / dataPointLength;

    const ticksLength = x.ticks.length + 1;

    data.datasets.forEach((dataset, index) => {
      chart.getDatasetMeta(index).data.forEach((datapoint, i) => {
         datapoint.x = segment * (i + 1) + ticksLength;

        ctx.font = "bold 10px sans-serif";
        ctx.fillStyle = theme === "light" ? "black" : "white";
        ctx.textAlign = "center";
        ctx.fillText(data.labels[i], datapoint.x, bottom + 15);

        ctx.font = "10px sans-serif";
        ctx.fillText(
          data.datasets[index].data[i],
          datapoint.x,
          bottom + 15 * (index + 2)
        );
      });
    });

    data.datasets.forEach((dataset, index) => {
      ctx.font = "bold 10px sans-serif";
      ctx.fillStyle = data.datasets[index].borderColor;
      ctx.fillStyle = theme === "light" ? "black" : "white";
      ctx.textAlign = "left";
      ctx.fillText(data.datasets[index].label, 0, bottom + 15 * (index + 2));
    });
  },
}; */

/* const chartData = {
    labels: item?.data?.map((dataItem) => dataItem?.created_at),

    datasets: [
      {
        label: "Pass",
        backgroundColor: item.data.map((dataItem) => {
          return dataItem.stable
            ? "green"
            : draw("diagonal-right-left", "#00008B");
        }),
        maxBarThickness: 100,
        borderColor: "black",

        borderWidth: 1,
        borderDashOffset: 5.5,

        data: item.data.map((dataItem) => {
          const resultsCount = dataItem.steps.reduce(
            (totals, step) => {
              totals[step.result.toLowerCase()]++;
              return totals;
            },
            { pass: 0, fail: 0, not_testable: 0 }
          );

          return resultsCount.pass;
        }),
      },
      {
        label: "Fail",
        backgroundColor: item.data.map((dataItem) => {
          return dataItem.stable
            ? "red"
            : draw("diagonal-right-left", "#00008B");
        }),
        maxBarThickness: 100,
        borderColor: "black",
        borderWidth: 1,
        data: item.data.map((dataItem) => {
          const resultsCount = dataItem.steps.reduce(
            (totals, step) => {
              totals[step?.result.toLowerCase()]++;
              return totals;
            },
            { pass: 0, fail: 0, not_testable: 0 }
          );

          return resultsCount.fail;
        }),
      },
      {
        label: "Not Testable",
        backgroundColor: item.data.map((dataItem) => {
          return dataItem.stable
            ? "gray"
            : draw("diagonal-right-left", "#00008B");
        }),
        maxBarThickness: 100,
        borderColor: "black",
        borderWidth: 1,
        data: item.data.map((dataItem) => {
          const resultsCount = dataItem.steps.reduce(
            (totals, step) => {
              totals[step.result.toLowerCase()]++;
              return totals;
            },
            { pass: 0, fail: 0, not_testable: 0 }
          );

          return resultsCount.not_testable;
        }),
      },
      {
        label: "Cases",
        backgroundColor: item.data.map((dataItem) => {
          return dataItem.stable
            ? "lightgray"
            : draw("diagonal-right-left", "#00008B");
        }),
        maxBarThickness: 100,
        borderColor: "black",
        borderWidth: 1,

        data: item.data.map((dataItem) => {
          const resultsCount = dataItem.steps.reduce(
            (totals, step) => {
              totals[step.result.toLowerCase()]++;
              return totals;
            },
            { pass: 0, fail: 0, not_testable: 0 }
          );

          return (
            totalTests[0] -
            (resultsCount.pass + resultsCount.fail + resultsCount.not_testable)
          );
        }),
      },
    ],
  }; */
