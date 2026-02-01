const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "กรุณากรอกชื่อผู้จอง"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "กรุณากรอกเบอร์โทร"],
      match: [/^[0-9]{9,10}$/, "รูปแบบเบอร์โทรไม่ถูกต้อง"],
    },
    bookingDate: {
      type: Date,
      required: [true, "กรุณาเลือกวันที่จอง"],
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // 🔗 เชื่อมกับ Service
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
