//เพื่อเช็คสถานะ API ว่าทำงานปกติ
const express = require("express");
const cors = require("cors");

const serviceRoutes = require("./routes/service.routes");
const bookingRoutes = require("./routes/booking.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-access-token"]
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Equipment Rental API is running");
});

app.use("/api/services", serviceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);

module.exports = app;


