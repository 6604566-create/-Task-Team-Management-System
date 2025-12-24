import { Schema, model } from 'mongoose';

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['On Hold', 'In Progress', 'Testing', 'Completed'],
      required: true,
    },
    priority: {
      type: String,
      enum: ['Most Important', 'Important', 'Least Important'],
      required: true,
    },
  },
  {
    timestamps: true, // ✅ THIS FIXES "Invalid Date"
  }
);

export default model('Project', projectSchema);
