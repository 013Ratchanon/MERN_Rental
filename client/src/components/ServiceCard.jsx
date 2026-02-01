import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import Button from './Button';

const ServiceCard = ({ service }) => {
  const navigate = useNavigate();

  // กำหนดราคาฟอลแบ็ก
  const price = service.price || service.pricePerDay || 0;

  return (
    <Card hover>
      <div className="space-y-4">
        {/* รูปภาพ */}
        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
          {service.imageUrl ? (
            <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              ไม่มีรูปภาพ
            </div>
          )}
        </div>

        {/* ข้อมูลอุปกรณ์ */}
        <h3 className="text-xl font-bold text-gray-800">{service.name}</h3>
        <p className="text-gray-600 line-clamp-2">{service.description}</p>
        <p className="text-primary-600 font-bold text-lg">฿{price} / วัน</p>

        {/* ปุ่มดูรายละเอียด */}
        <Button 
          fullWidth 
          onClick={() => navigate(`/services/${service._id}`)}
        >
          ดูรายละเอียด
        </Button>

        {/* ปุ่มจอง เฉพาะกรณี available */}
        {service.available && (
          <Button
            fullWidth
            variant="primary"
            onClick={() => navigate(`/booking/${service._id}`)}
          >
            จองเลย
          </Button>
        )}

        {/* สถานะ availability */}
        <div className={`text-sm font-medium mt-2 px-2 py-1 rounded-full ${
          service.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {service.available ? 'พร้อมให้บริการ' : 'ไม่พร้อมให้บริการ'}
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;
