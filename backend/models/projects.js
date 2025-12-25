import { Schema, model } from "mongoose";

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["On Hold", "In Progress", "Testing", "Completed"],
      default: "In Progress",
    },

    priority: {
      type: String,
      enum: ["Most Important", "Important", "Least Important"],
      default: "Important",
    },
  },
  {
    timestamps: true, // ✅ GOOD (createdAt, updatedAt)
  }
);

export default model("Project", projectSchema);
