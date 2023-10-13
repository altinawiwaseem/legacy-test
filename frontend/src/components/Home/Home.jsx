import React, { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { TestContext } from "../Context/TestContext";

const Home = () => {
  const { user, token } = useContext(UserContext);
  const { handleNewTest } = useContext(TestContext);

  const [formData, setFormData] = useState({
    market_variant: "",
    screen_size: "",
    test_object: "",
    project: "",
    build_number: "",
  });

  const [errors, setErrors] = useState({
    market_variant: "",
    screen_size: "",
    test_object: "",
    project: "",
    build_number: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the form data
    const newErrors = {
      market_variant: formData.market_variant
        ? ""
        : "Market variant is required",
      screen_size: formData.screen_size ? "" : "Screen size is required",
      test_object: formData.test_object ? "" : "Test object is required",
      project: formData.project ? "" : "Project is required",
      build_number: formData.build_number ? "" : "The build number is required",
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (
      Object.values(newErrors).every((error) => error === "") &&
      Object.values(formData).every((value) => value !== "")
    ) {
      handleNewTest(formData, token);
    }
  };

  return (
    <div className="bg-gray-100 w-screen flex flex-col  items-center">
      <div className="bg-white  rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-1 text-center">Legacy Test</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-2 w-screen px-3">
            <div>
              <label htmlFor="market_variant" className="text-gray-600 text-xs">
                Market Variant:
              </label>
              <select
                type="text"
                id="market_variant"
                name="market_variant"
                value={formData.market_variant}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-1 text-xs"
              >
                <option value="">Select a Variant</option>
                <option value="EU">EU</option>
                <option value="EU_SMALL">EU Small</option>
                <option value="JP">JP</option>
                <option value="JP_SMALL">JP Small</option>
                <option value="KOR">KOR</option>
                <option value="MRM">MRM</option>
                <option value="NAR">NAR</option>
                <option value="CT">CT</option>
              </select>

              <span className="text-red-500 text-xs block mt-1">
                {errors.market_variant}
              </span>
            </div>
            <div>
              <label htmlFor="screen_size" className="text-gray-600 text-xs">
                Screen Size:
              </label>
              <input
                type="text"
                id="screen_size"
                name="screen_size"
                value={formData.screen_size}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-1 text-xs"
              />
              <span className="text-red-500 text-xs block mt-1">
                {errors.screen_size}
              </span>
            </div>
            <div>
              <label htmlFor="test_object" className="text-gray-600 text-xs">
                Test Object:
              </label>
              <select
                id="test_object"
                name="test_object"
                value={formData.test_object}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-1 text-xs"
              >
                <option value="">Select a Project</option>
                <option value="SIMULATOR">Simulator</option>
                <option value="REMOTE_TARGET">Remote Target</option>
              </select>
              <span className="text-red-500 text-xs block mt-1">
                {errors.test_object}
              </span>
            </div>
            <div className="mb-1">
              <label htmlFor="project" className="text-gray-600 text-xs">
                Project:
              </label>
              <select
                id="project"
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-1 text-xs"
              >
                <option value="">Select a Project</option>
                <option value="F380">F380</option>
                <option value="F307">F307</option>
                <option value="F386">F386</option>
                <option value="F61">F61</option>
              </select>
              <span className="text-red-500 text-xs block mt-1">
                {errors.project}
              </span>
            </div>

            <div>
              <label htmlFor="build_number" className="text-gray-600 text-xs">
                Build Number:
              </label>
              <input
                type="text"
                id="build_number"
                name="build_number"
                value={formData.build_number}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded p-1 text-xs"
              />
              <span className="text-red-500 text-xs block mt-1">
                {errors.build_number}
              </span>
            </div>
          </div>
          <div className="w-full flex justify-center items-center mt-2">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mb-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
