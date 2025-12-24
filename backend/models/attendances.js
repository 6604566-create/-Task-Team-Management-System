import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ MUST MATCH YOUR USER MODEL
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
    timestamps: true, // ✅ IMPORTANT
  }
);

export default mongoose.model("Attendance", attendanceSchema);
