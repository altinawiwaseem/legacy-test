import "./Legend.css";
const Legend = () => {
  const colorData = [
    { color: "not-testable", description: "Not Testable" },
    { color: "fail", description: "Fail" },
    { color: "pass", description: "Pass" },
  ];

  return (
    <div className="legend-container">
      <div className="legend">
        {colorData.map((item, index) => (
          <div key={index} className="legend-square">
            <div
              className={`legend-square-inner diagram-${item.color}-color`}
            ></div>
            <span>{item.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Legend;
