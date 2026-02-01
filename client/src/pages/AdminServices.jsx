import React, { useState, useEffect } from 'react';
import { serviceService } from '../services/serviceService';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
  });

  useEffect(() => {
    fetchServices();
  }, []);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingService) {
        await serviceService.update(editingService._id, formData);
        alert('อัพเดทอุปกรณ์สำเร็จ');
      } else {
        await serviceService.create(formData, imageFile);
        alert('สร้างอุปกรณ์สำเร็จ');
      }
      
      resetForm();
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('เกิดข้อผิดพลาด: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      category: service.category,
      available: service.available,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('คุณแน่ใจหรือไม่ที่จะลบอุปกรณ์นี้?')) {
      return;
    }

    try {
      await serviceService.delete(id);
      alert('ลบอุปกรณ์สำเร็จ');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('เกิดข้อผิดพลาดในการลบ');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      available: true,
    });
    setImageFile(null);
    setEditingService(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            จัดการอุปกรณ์
          </h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'ยกเลิก' : '+ เพิ่มอุปกรณ์ใหม่'}
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingService ? 'แก้ไขอุปกรณ์' : 'เพิ่มอุปกรณ์ใหม่'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="ชื่ออุปกรณ์"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  รายละเอียด <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="ราคา (บาท/วัน)"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  required
                />

                <Input
                  label="หมวดหมู่"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  placeholder="เช่น กล้อง, คอมพิวเตอร์, อุปกรณ์กีฬา"
                />
              </div>

              {!editingService && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    รูปภาพอุปกรณ์
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  {imageFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      ไฟล์ที่เลือก: {imageFile.name}
                    </p>
                  )}
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-primary-600"
                />
                <label className="text-sm text-gray-700">
                  พร้อมให้บริการ
                </label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" fullWidth>
                  {editingService ? 'บันทึกการแก้ไข' : 'เพิ่มอุปกรณ์'}
                </Button>
                <Button type="button" variant="secondary" fullWidth onClick={resetForm}>
                  ยกเลิก
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Services List */}
        <div className="grid grid-cols-1 gap-6">
          {services.map((service) => (
            <Card key={service._id}>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image */}
                <div className="w-full md:w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  {service.imageUrl ? (
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">
                        {service.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {service.category}
                        </span>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                          service.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {service.available ? 'พร้อมให้บริการ' : 'ไม่พร้อม'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary-600">
                        ฿{service.price}
                      </div>
                      <div className="text-sm text-gray-500">/วัน</div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                    >
                      แก้ไข
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(service._id)}
                    >
                      ลบ
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {services.length === 0 && (
          <Card>
            <div className="text-center py-12">
              <p className="text-gray-500">ยังไม่มีอุปกรณ์ในระบบ</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminServices;