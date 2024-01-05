import { useRef, useState } from "react";
import { Rnd } from "react-rnd";
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
const DiagramBar = ({ item, theme, onBarClick, originalData, title }) => {
  const totalTests = item.data
    ? item.data.map((step) => step.steps.length)
    : [];

  const resultsData = item.data.map((dataItem) =>
    dataItem.steps.reduce(
      (totals, step) => {
        totals[step.result.toLowerCase()]++;
        return totals;
      },
      { pass: 0, fail: 0, not_testable: 0 }
    )
  );

  const passData = resultsData ? resultsData.map((result) => result.pass) : [];
  const failData = resultsData ? resultsData.map((result) => result.fail) : [];
  const notTestableData = resultsData
    ? resultsData.map((result) => result.not_testable)
    : [];

  const totalCasesData = totalTests?.map((total) => total);

  const chartData = {
    labels: item?.data?.map((dataItem) => dataItem?.created_at) || [],

    datasets: [
      {
        label: "Pass",
        backgroundColor: item.data.map((dataItem) => {
          if (dataItem.test_object === "REMOTE_TARGET") {
            if (dataItem.stable) {
              return "#007acc";
            } else {
              return draw("diagonal-right-left", "#FF6347");
            }
          } else if (dataItem.stable) {
            return "green";
          } else {
            return draw("diagonal-right-left", "#00008B");
          }
        }),
        maxBarThickness: 100,
        borderColor: "black",
        borderWidth: item.data.map((dataItem) => {
          return dataItem.stable ? 1 : 0;
        }),
        data: passData,
      },
      {
        label: "Fail",
        backgroundColor: item.data.map((dataItem) => {
          if (dataItem.test_object === "REMOTE_TARGET") {
            if (dataItem.stable) {
              return "#ff7200";
            } else {
              return draw("diagonal-right-left", "#FF6347");
            }
          } else if (dataItem.stable) {
            return "red";
          } else {
            return draw("diagonal-right-left", "#00008B");
          }
        }),
        maxBarThickness: 100,
        borderColor: "black",
        borderWidth: item.data.map((dataItem) => {
          return dataItem.stable ? 1 : 0;
        }),
        data: failData,
      },
      {
        label: "Not Testable",
        backgroundColor: item.data.map((dataItem) => {
          if (dataItem.test_object === "REMOTE_TARGET") {
            if (dataItem.stable) {
              return "#9467bd";
            } else {
              return draw("diagonal-right-left", "#FF6347");
            }
          } else if (dataItem.stable) {
            return "gray";
          } else {
            return draw("diagonal-right-left", "#00008B");
          }
        }),
        maxBarThickness: 100,
        borderColor: "black",
        borderWidth: item.data.map((dataItem) => {
          return dataItem.stable ? 1 : 0;
        }),
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
        "marketVariantY",
        "testObjectY",
      ].reduce((acc, key, index) => {
        acc[key] = bottom + 9 + 15 * index;
        return acc;
      }, {});

      data.datasets.forEach((dataset, index) => {
        chart.getDatasetMeta(index).data.forEach((datapoint, i) => {
          ctx.fillStyle = theme === "light" ? "black" : "white";
          ctx.textAlign = "center";
          const timestamp = data?.labels[i];

          // Find the corresponding object in the array based on id[i]
          const correspondingObject = originalData?.find(
            (item) => item?.created_at === timestamp
          );

          // Access properties based on the correspondingObject
          const date = (timestamp && correspondingObject?.kw) || "";

          const buildNumber =
            (timestamp && correspondingObject?.build_number) || "";

          const marketVariant =
            timestamp && correspondingObject?.market_variant !== undefined
              ? correspondingObject?.market_variant || ""
              : "";

          const testObject =
            timestamp && correspondingObject?.test_object === "REMOTE_TARGET"
              ? "RT" || ""
              : correspondingObject?.test_object || "";

          const value = data?.datasets[index].data[i];

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
          const marketVariantY = verticalOffsets.marketVariantY;
          const testObjectY = verticalOffsets.testObjectY;

          const valueY = bottom + 15 * (index + 4.6); // Adjust index for additional elements

          ctx.font = `normal ${labelFontSize}px sans-serif`;

          ctx.fillText(
            date !== undefined ? date : "",
            labelX + labelWidth / 2,
            dateY
          );

          ctx.fillText(
            buildNumber !== undefined ? buildNumber : "",
            labelX + labelWidth / 2,
            buildNumberY
          );

          ctx.fillText(
            marketVariant !== undefined ? marketVariant : "",
            labelX + labelWidth / 2,
            marketVariantY
          );

          ctx.font = `normal 7px sans-serif`;
          ctx.fillText(
            testObject !== undefined ? testObject : "",
            labelX + labelWidth / 2,
            testObjectY
          );

          ctx.font = `bold 10px sans-serif`;

          ctx.fillText(value, valueX + valueWidth / 2, valueY);
        });
      });

      ctx.font = "normal 10px sans-serif";

      ctx.fillStyle = theme === "light" ? "black" : "white";
      ctx.textAlign = "left";
      ctx.fillText("KW", 0, bottom + 9);

      ctx.fillText("Build Number", 0, bottom + 24);

      ctx.fillText("Market Variant", 0, bottom + 40);

      data.datasets.forEach((dataset, index) => {
        ctx.font = "normal 10px sans-serif";

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
        text: title,
        align: "center",
        /* padding: {
            top: 10,
             bottom: 10, 
          },*/
      },
      legend: {
        display: true,
        position: "top",
        onClick: null,
        labels: {
          /* boxWidth: 25, */
          generateLabels: (chart) => {
            const legendData = [
              { text: "Pass", color: "green" },
              { text: "Fail", color: "red" },
              { text: "Not Testable", color: "gray" },
              {
                text: "Not Stable",
                color: draw("diagonal-right-left", "#00008B"),
              },

              { text: "RT Pass", color: "#007acc" },
              { text: "RT Fail", color: "#ff7200" },
              { text: "RT Not Testable", color: "#9467bd" },
              {
                text: "RT Not Stable",
                color: draw("diagonal-right-left", "#FF6347"),
              },
            ];

            return legendData.map((item, index) => ({
              text: item.text,
              fillStyle: item.color,
            }));
          },
        },
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

export default DiagramBar;
