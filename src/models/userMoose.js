import mongoose, { Schema } from "mongoose";

const userMooseSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.UserMoose || mongoose.model("UserMoose", userMooseSchema);
