import mongoose from "mongoose";
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "the user must have an Email"],
    unique: true,
  },
  firstName: {
    type: String,
    required: [true, "the user must have a firstName"],
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "the user must have a password"],
    select: false,
  },

  dates: { registered: { type: Date, default: Date.now }, last_active: Date },
  admin: Boolean,
  testResults: {
    sessionId: String,
    createdOn: { type: Date, default: Date.now },
    type: Array,
  },
});

const User = model("user", UserSchema);

export default User;
