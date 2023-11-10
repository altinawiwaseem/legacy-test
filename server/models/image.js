import mongoose from "mongoose";
const { Schema, model } = mongoose;

export const imageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  data: {
    type: Buffer,
    required: true,
  },
});

export const Image = model("Image", imageSchema);
