import { Schema, model } from "mongoose";

const employeeSchema = new Schema(
  {
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
      type: String,
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
      enum: ["Admin", "Manager", "Employee"],
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
      enum: ["Male", "Female", "Other"],
      default: "Other",
    },
  },
  { timestamps: true }
);

// Indexes
employeeSchema.index({ email: 1 });
employeeSchema.index({ cnic: 1 });

export default model("Employee", employeeSchema);
