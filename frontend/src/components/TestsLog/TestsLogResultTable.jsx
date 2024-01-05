import React from "react";

const TestsLogResultTable = (tableData) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>Name</th>
            <th>Mismatch Percentage</th>
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData?.tableData?.result?.map((item, i) => (
              <tr className={item.mismatchPercentage === 0 ? "pass" : "fail"}>
                <td>{i + 1}</td>
                <td>{item.imageName.replace(/\.[^/.]+$/, "")}</td>
                <td>{item.mismatchPercentage.toFixed(2)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestsLogResultTable;
