const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      default: ""
    },

    avatar: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      default: ""
    },

    github: {
      type: String,
      default: ""
    },

    linkedin: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    },

    role: {
      type: String,
      default: "student",
      enum: ["student"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);