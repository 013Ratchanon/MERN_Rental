const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.controller");
const { protect } = require("../middleware/auth.middleware.js");

router.post("/create", protect, bookingController.createBooking);

// ดึง booking ของลูกค้า
router.get("/customer/:customerName", protect, bookingController.getBookingsByCustomer);

// ดึง booking ทั้งหมด (Admin)
router.get("/", bookingController.getAllBookings);

// อัปเดตสถานะ booking
router.put("/:id/status", bookingController.updateBookingStatus);

module.exports = router;
