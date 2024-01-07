import React from "react";

const DiagramTable = ({ item }) => {
  // Function to calculate counts of each result type
  const calculateResults = (steps) => {
    return steps.reduce(
      (totals, step) => {
        const result = step.result.toLowerCase();
        if (totals[result] !== undefined) {
          totals[result]++;
        } else {
          totals[result] = 1; // Initialize count for new result type
        }
        return totals;
      },
      { pass: 0, fail: 0, not_testable: 0 }
    );
  };

  /*  const calculateResults = (steps) => {
    return steps.reduce(
      (totals, step) => {
        totals[step.result.toLowerCase()]++;
        return totals;
      },
      { pass: 0, fail: 0, not_testable: 0 }
    );
  }; */

  return (
    <div className="table-container">
      <table className="diagram-table table">
        <thead>
          <tr>
            <th>Build Number</th>
            <th>Date</th>
            <th>KW</th>
            <th>Market Variant</th>
            <th>Type</th>
            <th>Screen Size</th>
            <th>Cases</th>
            <th>Pass</th>
            <th>Fail</th>
            <th>Not Testable</th>
            <th>Frequent Crashes</th>
          </tr>
        </thead>
        <tbody>
          {item &&
            item?.data?.map((el, i) => (
              <tr>
                {" "}
                <td>{el?.build_number}</td>
                <td>{new Date(el?.created_at)?.toISOString()?.slice(0, 10)}</td>
                <td>{el?.kw}</td>
                <td>{el?.market_variant}</td>
                <td>{el?.test_object}</td>
                <td>{el?.screen_size}</td>
                <td>{el?.steps?.length}</td>
                <td>{calculateResults(el?.steps).pass}</td>
                <td>{calculateResults(el?.steps).fail}</td>
                <td>{calculateResults(el?.steps).not_testable}</td>
                <td>{el?.stable === true ? "Sable" : "Not Stable"}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DiagramTable;
