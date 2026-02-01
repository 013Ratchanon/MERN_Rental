import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

// Pages
import Home from "../pages/Home";
import Services from "../pages/Services";
import CreateService from "../pages/CreateService";
import ServiceDetail from "../pages/ServiceDetail";
import Profile from "../pages/Profile";
import BookingPage from "../pages/BookingPage"; // แก้ชื่อไฟล์ให้ตรง
import Bookings from "../pages/Bookings";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminServices from "../pages/AdminServices";
import AdminBookings from "../pages/AdminBookings";
import MyBookings from "../pages/MyBookings";

// Components

import Navbar from "../components/Navbar";

const AppRouter = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/create" element={<CreateService />} />
          <Route path="/services/:id" element={<ServiceDetail />} />
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-bookings" element={
  <ProtectedRoute>
    <MyBookings />
  </ProtectedRoute>
} />


          {/* User Routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/bookings" element={<ProtectedRoute><Bookings /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin/services" element={<ProtectedRoute><AdminServices /></ProtectedRoute>} />
          <Route path="/admin/bookings" element={<ProtectedRoute><AdminBookings /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default AppRouter;
