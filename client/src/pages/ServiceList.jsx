import React, { useEffect, useState } from 'react';
import { serviceService } from '../services/serviceService';
import ServiceCard from './ServiceCard';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await serviceService.getAll();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return <p className="text-center text-gray-600">กำลังโหลดอุปกรณ์...</p>;
  if (!services.length) return <p className="text-center text-gray-600">ไม่มีอุปกรณ์ให้แสดง</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map(service => (
        <ServiceCard key={service._id || service._key} service={service} />
      ))}
    </div>
  );
};

export default ServiceList;
