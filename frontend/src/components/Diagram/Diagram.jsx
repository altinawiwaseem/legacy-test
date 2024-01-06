import { useCallback, useContext, useEffect, useRef, useState } from "react";

/* import Legend from "../Legend/Legend"; */
import "./Diagram.css";

import { ThemeContext } from "../Context/ThemeContext/ThemeContext";
import DiagramBar from "./DiagramBar";

const Diagram = ({
  data,
  groupedBy,
  onBarClick,
  originalData,
  barsPerChart,
}) => {
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
        return group.key;
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

  /*   const chunkArray = (arr, chunkSize) => {
    console.log(arr);
    const chunks = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
      chunks.push(arr.slice(i, i + chunkSize));
    }
    return chunks;
  }; */

  const chunkArray = (arr) => {
    const chunks = [];
    let currentChunk = [];

    arr.forEach((bar) => {
      if (currentChunk.length >= barsPerChart) {
        chunks.push(currentChunk);
        currentChunk = [];
      }

      currentChunk.push(bar);
    });

    if (currentChunk.length > 0) {
      chunks.push(currentChunk);
    }

    return chunks;
  };

  return (
    <div className="diagrams-group-container">
      {dataArray?.map((group, groupIndex) => (
        <div key={`group-${groupIndex}`} className="diagram-groups">
          <div className={`diagrams-group`}>
            {group?.data ? (
              chunkArray(group.data).map((chunk, chunkIndex) => (
                <div key={`chunk-${chunkIndex}`} className="diagram-bar">
                  <DiagramBar
                    title={getGroupHeader(group)}
                    item={{ key: group.key, data: chunk }}
                    theme={theme}
                    onBarClick={handleBarClick}
                    originalData={originalData}
                    groupedBy={groupedBy}
                  />
                </div>
              ))
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
    </div>
  );
};

export default Diagram;
