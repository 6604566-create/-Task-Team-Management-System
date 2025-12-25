import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    day: {
      type: String,
      required: true,
    },

    timeIn: {
      type: String,
      default: null,
    },

    timeOut: {
      type: String,
      default: null,
    },

    workingHours: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent duplicate attendance per day
attendanceSchema.index({ employee: 1, day: 1 }, { unique: true });

export default mongoose.model("Attendance", attendanceSchema);
