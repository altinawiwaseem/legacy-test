import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const TestStepsSchema = new Schema({
  step_number: {
    type: Number,
    required: [true, "Step number is required"],
  },
  step_details: {
    type: String,
    required: [true, "Step details is required"],
  },
  expected_results: {
    type: String,
    required: [true, "Expected result is required"],
  },
  result: {
    type: String,
    default: "",
    enum: ["Pass", "Fail", "Not Testable", ""],
  },
  actual_result: { type: String, default: "" },
});

export const StepsData = model("stepsData", TestStepsSchema);
