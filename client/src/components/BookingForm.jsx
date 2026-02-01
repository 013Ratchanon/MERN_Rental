import React, { useState } from 'react';
import Button from './Button';

const BookingForm = ({ service, onSubmit, loading }) => {
  const [phone, setPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [days, setDays] = useState(1);

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!phone.trim()) newErrors.phone = 'กรุณากรอกเบอร์โทร';
    if (!bookingDate) newErrors.bookingDate = 'กรุณาเลือกวันที่จอง';
    if (days < 1) newErrors.days = 'จำนวนวันต้องมากกว่า 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({ phone, bookingDate, days });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-black">
      <h2 className="text-xl font-bold mb-4">จองอุปกรณ์: {service.name}</h2>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">เบอร์โทร</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black"
          placeholder="กรอกเบอร์โทรของคุณ"
        />
        {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">วันที่จอง</label>
        <input
          type="date"
          value={bookingDate}
          onChange={(e) => setBookingDate(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black"
        />
        {errors.bookingDate && <p className="text-red-600 text-sm mt-1">{errors.bookingDate}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-semibold">จำนวนวัน</label>
        <input
          type="number"
          min="1"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black"
        />
        {errors.days && <p className="text-red-600 text-sm mt-1">{errors.days}</p>}
      </div>

      <div className="text-right">
        <Button type="submit" disabled={loading} fullWidth>
          {loading ? 'กำลังจอง...' : 'จองตอนนี้'}
        </Button>
      </div>
    </form>
  );
};

export default BookingForm;
