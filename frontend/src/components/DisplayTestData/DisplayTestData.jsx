import { useEffect, useState } from "react";

const DisplayTestData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem("displayTestData");
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  return (
    <div>
      <div>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-300 w-full">
              <th className="border border-gray-300 px-4 py-2 w-1/5">Tester</th>
              <th className="border border-gray-300 px-4 py-2 w-1/5">
                Edited By
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/5">Date</th>
              <th className="border border-gray-300 px-4 py-2 w-1/5">Stable</th>
              <th className="border border-gray-300 px-4 py-2 w-1/5">
                Build Number
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {data?.username}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {data?.edited_by}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {data?.created_at &&
                  new Date(data?.created_at)?.toISOString()?.slice(0, 10)}
              </td>
              <td className="border border-gray-300 px-4 py-2 text-center">
                {data?.stable ? "True" : "False"}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {data.build_number}
              </td>
            </tr>
          </tbody>
        </table>

        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 w-1/4">
                Market Variant
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/4">
                Project
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/4">
                Screen Size
              </th>
              <th className="border border-gray-300 px-4 py-2 w-1/4">
                Test Object
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">
                {data?.market_variant}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {data?.project}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {data.screen_size}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {data.test_object}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {data?.notes && (
        <div className="my-2 flex flex-col items-center">
          <h2 className="font-bold">Notes</h2>
          <div
            className="w-full h-32 p-4 border-2"
            style={{ whiteSpace: "pre-line" }}
          >
            {data?.notes}
          </div>
        </div>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-200">
          <tr>
            <th className=" border  border-gray-300">No.</th>

            <th className=" border  border-gray-300">Test Case ID</th>
            <th className={`px-4 py-2 border border-gray-300 `}>
              Step Details
            </th>
            <th className={`px-4 py-2 border border-gray-300 `}>
              Expected Results
            </th>
            <th className={`px-4 py-2 border border-gray-300 `}>
              Actual Result
            </th>
            <th className={`px-4 py-2 border border-gray-300 `}>Result</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.steps
            ?.sort((a, b) => a.step_id - b.step_id)
            .map((step, index) => (
              <tr key={index} className="hover:bg-gray-300">
                <td className="w-2 px-4 py-2 border border-gray-300 ">
                  {index + 1}
                </td>
                <td className={`w-2 px-4 py-2 border border-gray-300 `}>
                  {step.step_id}
                </td>
                <td
                  className={`px-4 py-2 border border-gray-300 
                    `}
                >
                  {step.step_details}
                </td>
                <td
                  className={`px-4 py-2 border border-gray-300 
                   `}
                >
                  {step.expected_results}
                </td>
                <td
                  className={`px-4 py-2 border border-gray-300 
                    `}
                >
                  {step.actual_result}
                </td>
                <td
                  className={`px-4 py-2 border border-gray-300 
                       `}
                >
                  {step.result}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayTestData;
