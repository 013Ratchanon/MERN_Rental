import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { bookingService } from "../services/bookingService";
import Card from "../components/Card";

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const data = await bookingService.getByCustomerName(user.username);
        setBookings(data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchBookings();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (!bookings.length) return <div>คุณยังไม่มีรายการจอง</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">รายการจองของฉัน</h1>
      <div className="space-y-4">
        {bookings.map((b) => (
          <Card key={b._id}>
            <div className="p-4">
              <h2 className="text-xl font-bold">{b.service.name}</h2>
              <p>วันที่จอง: {new Date(b.bookingDate).toLocaleDateString()}</p>
              <p>จำนวนวัน: {b.days}</p>
              <p>ราคา: ฿{b.totalPrice}</p>
              <p>สถานะ: {b.status}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
