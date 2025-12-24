import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    assignTo: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    // ✅ Task progress (0–100)
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // ✅ Auto-managed status
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },

    priority: {
      type: String,
      enum: ["Most Important", "Important", "Least Important"],
      required: true,
    },
  },
  {
    timestamps: true, // ✅ REQUIRED for createdAt & updatedAt
  }
);

export default model("Task", taskSchema);
