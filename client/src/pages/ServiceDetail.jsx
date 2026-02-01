import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { serviceService } from '../services/serviceService';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../contexts/AuthContext';
import BookingForm from '../components/BookingForm';
import Button from '../components/Button';
import Card from '../components/Card';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch service by id
  useEffect(() => {
    const fetchService = async () => {
      setLoading(true);
      try {
        const data = await serviceService.getById(id);
        data.price = data.price || data.pricePerDay || 0;
        data.available = data.available ?? true;
        setService(data);
      } catch (err) {
        console.error('Error fetching service:', err);
        setService(null);
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [id]);

  // Handle booking submission
  const handleBooking = async (bookingData) => {
  if (!isAuthenticated) {
    navigate('/login', { state: { from: `/services/${id}` } });
    return;
  }

  setBookingLoading(true);
  try {
    // ส่งข้อมูล user ให้ backend ถูกต้อง
    await bookingService.create({
      service: service._id,
      customerName: user.username, // ให้ตรงกับ backend
      phone: bookingData.phone,
      bookingDate: bookingData.bookingDate,
      days: bookingData.days,
      totalPrice: (bookingData.days || 1) * (service.price || 0),
    });

    alert('จองสำเร็จ! คุณสามารถดูรายการจองของคุณได้');
    navigate('/my-bookings'); // เปลี่ยนไป MyBookings
  } catch (error) {
    console.error('Error creating booking:', error);
    alert(error.response?.data?.message || 'เกิดข้อผิดพลาดในการจอง กรุณาลองใหม่อีกครั้ง');
  } finally {
    setBookingLoading(false);
  }
};




  // Loading or service null
  if (loading || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Button variant="outline" onClick={() => navigate('/services')} className="mb-6">
          ← กลับ
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Info */}
          <div>
            <Card>
              <div className="space-y-6">
                {/* Image */}
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  {service?.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      ไม่มีรูปภาพ
                    </div>
                  )}
                </div>

                {/* Details */}
                <div>
                  <h1 className="text-3xl font-bold text-black">{service?.name}</h1>
                  <p className="text-black font-bold text-lg">฿{service?.price} / วัน</p>
                  <p className="text-black">{service?.description}</p>
                  <div className={`px-4 py-2 rounded-full text-sm font-medium mt-2 ${
                    service.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {service.available ? 'พร้อมให้บริการ' : 'ไม่พร้อมให้บริการ'}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Booking Form */}
          <div>
            {!isAuthenticated && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-black">กรุณาเข้าสู่ระบบก่อนทำการจอง</p>
                <Button size="sm" className="mt-2" onClick={() => navigate('/login', { state: { from: `/services/${id}` } })}>
                  เข้าสู่ระบบ
                </Button>
              </div>
            )}

            {service.available && isAuthenticated && (
              <BookingForm service={service} onSubmit={handleBooking} loading={bookingLoading} />
            )}

            {!service.available && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-black">
                อุปกรณ์ไม่พร้อมให้บริการ
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
