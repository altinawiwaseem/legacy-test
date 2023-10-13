import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { TestStepsSchema } from "./testSteps.js";

export const TestSessionSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "user" },
  created_at: { type: Date, default: Date.now },
  notes: { type: String },
  market_variant: {
    type: String,
    enum: ["EU", "KOR", "JP", "MRM", "NAR", "JP_SMALL", "EU_SMALL", "CT"],
    required: [true, "Market variant is required"],
  },
  screen_size: { type: String, required: [true, "Screen size is required"] },
  test_object: {
    type: String,
    enum: ["SIMULATOR", "REMOTE_TARGET"],
    required: [true, "test object is required"],
  },
  project: {
    type: String,
    enum: ["F380", "F307", "F386", "F61"],
    required: [true, "project is required"],
  },

  steps: [TestStepsSchema],
  stable: {
    type: Boolean,
    default: true,
  },

  build_number: {
    type: String,
    required: [true, "The build number is required"],
  },
});

const TestSession = model("testSession", TestSessionSchema);

export default TestSession;
