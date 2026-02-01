const Booking = require("../models/Booking");
const Service = require("../models/Service");

// POST /api/bookings (สร้างการจองใหม่)
exports.createBooking = async (req, res, next) => {
  try {
    const { customerName, phone, service, bookingDate, status } = req.body;

    const newBooking = new Booking({
      customerName,
      phone,
      service,
      bookingDate,
      status: status || "pending",
    });

    await newBooking.save();
    await newBooking.populate("service");

    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings/customer/:customerName
exports.getBookingsByCustomer = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ customerName: req.params.customerName })
      .populate("service"); // 🔹 ดึงข้อมูล service ด้วย
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/bookings (ดึงทั้งหมด, สำหรับ Admin)
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("service")
      .sort({ bookingDate: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/bookings/:id/status (อัปเดตสถานะ)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["pending", "confirmed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "สถานะไม่ถูกต้อง" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("service");

    if (!booking) {
      return res.status(404).json({ message: "ไม่พบการจอง" });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
