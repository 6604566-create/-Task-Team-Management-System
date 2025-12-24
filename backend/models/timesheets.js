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
      ref: "Employee",
      required: [true, "Employee is required"],
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: [true, "Project is required"],
    },

    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: [true, "Task is required"],
    },

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    timeSpent: {
      type: Number,
      required: [true, "Time spent is required"],
      min: [0, "Time spent cannot be negative"],
    },

    workDate: {
      type: Date,
      required: [true, "Work date is required"],
    },

    type: {
      type: String,
      enum: ["Development", "Testing", "Other"],
      required: [true, "Timesheet type is required"],
    },
  },
  { timestamps: true }
);

export default model("Timesheet", timesheetSchema);
