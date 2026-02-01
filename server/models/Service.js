const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "กรุณากรอกชื่ออุปกรณ์"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "กรุณากรอกรายละเอียด"],
    },
    pricePerDay: {
      type: Number,
      required: [true, "กรุณากรอกราคา"],
      min: [0, "ราคาต้องมากกว่าหรือเท่ากับ 0"],
    },
    imageUrl: {
      type: String,
      required: [true, "กรุณาอัปโหลดรูป"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);
