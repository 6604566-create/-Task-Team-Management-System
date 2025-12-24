import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
    // ❌ REMOVED employee_id (MongoDB _id is enough)

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String, // ✅ string, not number
    },

    residentialAddress: {
      type: String,
    },

    cnic: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
    },

    startDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["Active", "In Active", "Terminated"],
      default: "Active",
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      default: "Male",
    },
  },
  { timestamps: true }
);

export default model("Employee", employeeSchema);
