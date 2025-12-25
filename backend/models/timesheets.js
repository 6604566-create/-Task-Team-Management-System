import { Schema, model } from "mongoose";

const timesheetSchema = new Schema(
  {
    notes: {
      type: String,
      trim: true,
      default: "",
    },

    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee", // ✅ must match Employee model
      required: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    // 🔥 progress snapshot at time of logging
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // ⏱️ hours spent (decimal allowed: 1.5 hrs)
    timeSpent: {
      type: Number,
      required: true,
      min: 0,
    },

    workDate: {
      type: Date,
      required: true,
    },

    type: {
      type: String,
      enum: ["Development", "Testing", "Other"],
      default: "Development", // ✅ safer default
    },
  },
  {
    timestamps: true, // ✅ createdAt & updatedAt
  }
);

export default model("Timesheet", timesheetSchema);
