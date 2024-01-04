import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Rnd } from "react-rnd";
/* import Legend from "../Legend/Legend"; */
import "./Diagram.css";
import { draw } from "patternomaly";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { ThemeContext } from "../Context/ThemeContext/ThemeContext";

const Diagram = ({ data, groupedBy, onBarClick, originalData }) => {
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
          ...new Set(group?.data?.map((item) => item?.project)),
        ];
        return `${uniqueProjects.join(", ")}`;
      case "stable":
        const hasTrue = group?.data?.some((item) => item?.stable === true);

        if (hasTrue) {
          return "Stable";
        } else {
          return "Not Stable";
        }

      case "test_object":
        const uniqueTestObject = [
          ...new Set(group?.data?.map((item) => item?.test_object)),
        ];
        return ` ${uniqueTestObject.join(", ")}`;
      case "market_variant":
        const uniqueMarketVariant = [
          ...new Set(group?.data?.map((item) => item?.market_variant)),
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
      {dataArray?.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="diagram-groups">
          <div className={`group-text`}>{getGroupHeader(group)}</div>
          <div className={`diagrams-group`}>
            {group?.data ? (
              <div key={`item-${groupIndex}`} className="diagram-bar">
                <DiagramBar
                  item={group}
                  theme={theme}
                  onBarClick={handleBarClick}
                  originalData={originalData}
                />
              </div>
            ) : (
              <div key={`item-0`} className="diagram-bar">
                <DiagramBar
                  item={group}
                  theme={theme}
                  onBarClick={handleBarClick}
                  originalData={originalData}
                />
              </div>
            )}
          </div>
        </div>
      ))}
      {/* <Legend /> */}
    </div>
  );
};

const DiagramBar = ({ item, theme, onBarClick, originalData }) => {
  const totalTests = item?.data?.map((step) => step?.steps?.length);

  const resultsData = item.data.map((dataItem) =>
    dataItem.steps.reduce(
      (totals, step) => {
        totals[step.result.toLowerCase()]++;
        return totals;
      },
      { pass: 0, fail: 0, not_testable: 0 }
    )
  );

  const passData = resultsData.map((result) => result.pass);
  const failData = resultsData.map((result) => result.fail);
  const notTestableData = resultsData.map((result) => result.not_testable);

  const totalCasesData = totalTests.map((total) => total);

  const chartData = {
    labels: item?.data?.map((dataItem) => dataItem?.created_at),
    datasets: [
      {
        label: "Pass",
        backgroundColor: "green",
        borderWidth: 1,
        data: passData,
      },
      {
        label: "Fail",
        backgroundColor: "red",
        borderWidth: 1,
        data: failData,
      },
      {
        label: "Not Testable",
        backgroundColor: "gray",
        borderWidth: 1,
        data: notTestableData,
      },
    ],
  };

  const customScale = {
    id: "customScale",
    beforeDatasetsDraw(chart, args, plugins) {
      const {
        ctx,
        chartArea: { width, left, right, bottom },
        data,
      } = chart;

      const dataPointLength = data.labels.length;
      const segment = width / dataPointLength;

      const tableTop = bottom;
      const tableHeight = 15 * (data.datasets.length + 4) + 1; // Considering additional elements

      ctx.strokeStyle =
        theme === "light" ? " rgba(0, 0, 0, 0.3)" : "rgba(255, 255, 255, 0.3)";
      ctx.lineWidth = 0.4;
      ctx.strokeRect(left, tableTop, width, tableHeight);

      // Draw vertical lines for column separation
      for (let i = 1; i <= dataPointLength; i++) {
        const xPos = left + segment * i;

        ctx.beginPath();
        ctx.moveTo(xPos, tableTop);
        ctx.lineTo(xPos, tableTop + tableHeight);
        ctx.stroke();
      }

      // Draw horizontal lines for row separation
      for (let i = 1; i <= data.datasets.length + 5; i++) {
        // Considering additional elements
        const yPos = tableTop + 15 * i;
        ctx.beginPath();
        ctx.moveTo(left, yPos);
        ctx.lineTo(right, yPos);
        ctx.stroke();
      }

      const verticalOffsets = [
        "dateY",
        "buildNumberY",
        "kwY",
        "testObjectY",
      ].reduce((acc, key, index) => {
        acc[key] = bottom + 9 + 15 * index;
        return acc;
      }, {});

      data.datasets.forEach((dataset, index) => {
        chart.getDatasetMeta(index).data.forEach((datapoint, i) => {
          ctx.fillStyle = theme === "light" ? "black" : "white";
          ctx.textAlign = "center";
          const timestamp = data.labels[i];

          // Find the corresponding object in the array based on id[i]
          const correspondingObject = originalData.find(
            (item) => item.created_at === timestamp
          );

          // Access properties based on the correspondingObject
          const date = correspondingObject.created_at.split("T")[0];
          const buildNumber = correspondingObject.build_number;
          const kw =
            correspondingObject.kw !== undefined ? correspondingObject.kw : "";
          const testObject =
            correspondingObject.test_object === "REMOTE_TARGET"
              ? "RT"
              : correspondingObject.test_object;

          const value = data.datasets[index].data[i];

          let labelFontSize = 10;
          let valueFontSize = 12;

          // Measure the initial widths
          let labelWidth = ctx.measureText(date).width;
          let valueWidth = ctx.measureText(value).width;

          // Font size dynamic to fit within available space
          while (labelWidth > segment || valueWidth > segment) {
            labelFontSize--;
            valueFontSize--;

            ctx.font = `normal ${labelFontSize}px sans-serif`;
            labelWidth = ctx.measureText(date).width;

            ctx.font = `normal ${valueFontSize}px sans-serif`;
            valueWidth = ctx.measureText(value).width;

            if (labelFontSize <= 6 || valueFontSize <= 6) {
              // Minimum font size reached
              break;
            }
          }

          const labelX = datapoint.x - labelWidth / 2;
          const valueX = datapoint.x - valueWidth / 2;

          const dateY = verticalOffsets.dateY;
          const buildNumberY = verticalOffsets.buildNumberY;
          const kwY = verticalOffsets.kwY;
          const testObjectY = verticalOffsets.testObjectY;

          const valueY = bottom + 15 * (index + 4.6); // Adjust index for additional elements

          ctx.font = `normal ${labelFontSize}px sans-serif`;

          ctx.fillText(date, labelX + labelWidth / 2, dateY);
          ctx.fillText(kw, labelX + labelWidth / 2, kwY);
          ctx.fillText(buildNumber, labelX + labelWidth / 2, buildNumberY);

          ctx.font = `normal 7px sans-serif`;
          ctx.fillText(testObject, labelX + labelWidth / 2, testObjectY);

          ctx.font = `bold 10px sans-serif`;

          ctx.fillText(value, valueX + valueWidth / 2, valueY);
        });
      });

      data.datasets.forEach((dataset, index) => {
        ctx.font = "normal 10px sans-serif";
        /*   console.log(data.datasets[index]); */
        ctx.fillStyle = theme === "light" ? "black" : "white";
        ctx.textAlign = "left";
        ctx.fillText(
          data.datasets[index].label,
          0,
          bottom + 15 * (index + 4.6)
        );
      });
    },
  };

  const options = {
    maintainAspectRatio: false,
    interaction: { mode: "index" },
    type: "bar",
    onHover: (event, chartElement) => {
      event.native.target.style.cursor = chartElement[0]
        ? "pointer"
        : "default";
    },
    indexAxis: "x",
    layout: {
      padding: {
        bottom: 115,
        left: 50,
      },
    },
    barPercentage: 0.6,
    scales: {
      x: {
        stacked: true,

        ticks: {
          display: false,
        },
        grid: {
          drawTicks: false,
          color:
            theme === "light"
              ? " rgba(0, 0, 0, 0.1)"
              : "rgba(255, 255, 255, 0.2)",
          drawOnChartArea: false,
        },
      },

      y: {
        stacked: true,
        min: 0,
        max: 100,
        grid: {
          color:
            theme === "light"
              ? " rgba(0, 0, 0, 0.1)"
              : "rgba(255, 255, 255, 0.1)",
        },
      },
    },

    plugins: {
      title: {
        display: true,
        text: "TEST",
        align: "center",
        /* padding: {
          top: 10,
           bottom: 10, 
        },*/
      },
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          title: function (context) {
            return context[0].label.split("T")[0];
          },
        },
      },
    },
  };

  ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    customScale,
    Legend,
    Title
  );

  const chartRef = useRef();

  const handleBarClick = (event) => {
    if (getElementAtEvent(chartRef.current, event).length > 0) {
      const dataPoint = getElementAtEvent(chartRef.current, event)[0].index;

      if (onBarClick) {
        onBarClick(item.data[dataPoint]);
      }
    }
  };
  const [width, setWidth] = useState("90%");
  const [height, setHeight] = useState(400);
  const [xPos, setXPos] = useState(70);
  const [yPos, setYPos] = useState(50);

  return (
    <div
      style={{ width: "98vw", height: "100vh" }}
      className="diagram-container"
    >
      <div
        className={`diagram-box ${
          item.stable ? "diagram-stable" : "diagram-unstable"
        }`}
      >
        <div className="chartCard" style={{ position: "relative" }}>
          <Rnd
            size={{ width: width, height: height }}
            position={{ x: xPos, y: yPos }}
            onResize={(e, direction, ref, delta, position) => {
              setXPos(position.x);
              setYPos(position.y);

              const { offsetWidth: newWidth, offsetHeight: newHeight } = ref;
              setWidth(newWidth);
              setHeight(newHeight);
            }}
            disableDragging={true}
            /* bounds="parent" */
          >
            <div className={`chartBox ${theme}`}>
              <Bar
                className={` ${
                  item.stable ? "diagram-stable" : "diagram-unstable"
                }`}
                onClick={handleBarClick}
                ref={chartRef}
                data={chartData}
                options={options}
                plugins={[customScale]}
              ></Bar>
            </div>
          </Rnd>
        </div>
      </div>
    </div>
  );
};

export default Diagram;
