import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const NonEuTestStepsSchema = new Schema({
  step_id: {
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
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Image",
  },
  thumbnail: [Number],
  thumbnailContentType: String,
  image_name: String,
});

export const NonEuStepsData = model("NonEuStepsData", NonEuTestStepsSchema);
