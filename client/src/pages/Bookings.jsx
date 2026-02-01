// src/pages/Bookings.jsx
import React, { useEffect, useState } from 'react';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      let data = [];
      if (user?.role === 'admin') {
        data = await bookingService.getAll();
      } else {
        data = await bookingService.getByCustomerName(user?.name);
      }
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">รายการจองของฉัน</h1>
      {bookings.length === 0 ? (
        <p>คุณยังไม่มีการจอง</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map(booking => (
            <Card key={booking._id} className="p-4">
              <h2 className="font-bold text-lg">{booking.serviceName || booking.service?.name}</h2>
              <p>วันที่จอง: {new Date(booking.date).toLocaleDateString()}</p>
              <p>จำนวนวัน: {booking.days}</p>
              <p>สถานะ: <span className={booking.status === 'cancelled' ? 'text-red-600' : 'text-green-600'}>{booking.status}</span></p>
              <Button size="sm" className="mt-2" onClick={() => alert('ดูรายละเอียดการจอง')}>
                ดูรายละเอียด
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
