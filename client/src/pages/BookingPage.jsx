import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { bookingService } from "../services/bookingService";
import Card from "../components/Card";
import Button from "../components/Button";

const BookingPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return; // รอ auth load
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/bookings" } });
      return;
    }

    const fetchBookings = async () => {
      setLoading(true);
      try {
        let data = [];
        // admin เห็นทุก booking
        if (user.role === "admin") {
          data = await bookingService.getAll();
        } else {
          data = await bookingService.getByCustomerName(user.name);
        }
        setBookings(data);
        console.log("Bookings:", data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user, authLoading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-black">
        <h2 className="text-2xl font-bold mb-4">คุณยังไม่มีรายการจอง</h2>
        <Button onClick={() => navigate("/services")}>กลับไปหน้ารายการอุปกรณ์</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <h1 className="text-3xl font-bold text-black mb-6">รายการจองของคุณ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bookings.map((booking) => (
          <Card key={booking._id}>
            <div className="space-y-2 text-black">
              <p>
                <span className="font-bold">ชื่ออุปกรณ์:</span>{" "}
                {booking.service.name || booking.service}
              </p>
              <p>
                <span className="font-bold">วันที่จอง:</span>{" "}
                {new Date(booking.bookingDate).toLocaleDateString()}
              </p>
              <p>
                <span className="font-bold">จำนวนวัน:</span> {booking.days}
              </p>
              <p>
                <span className="font-bold">ราคาทั้งหมด:</span> ฿{booking.totalPrice}
              </p>
              <p>
                <span className="font-bold">สถานะ:</span>{" "}
                {booking.status || "รอดำเนินการ"}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingPage;
