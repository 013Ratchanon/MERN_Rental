//เชื่อมต่อฐานข้อมูล MongoDB และเริ่มต้นเซิร์ฟเวอร์
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const app = require("./app");
const connectDB = require("./config/db");

connectDB();

app.listen(process.env.PORT || 5000, () => {
  console.log(
    `Server running on http://localhost:${process.env.PORT || 5000}`
  );
});

