import api from './api';

export const serviceService = {
  // ดึง service ทั้งหมด
  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/services', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  // ดึง service ตาม id พร้อมส่ง token
  getById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/services/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return response.data;
  },

  // สร้าง service พร้อม upload รูป และส่ง token
  create: async (serviceData, imageFile) => {
    const token = localStorage.getItem('token');
    const formData = new FormData();

    Object.keys(serviceData).forEach(key => formData.append(key, serviceData[key]));
    if (imageFile) formData.append('image', imageFile);

    const response = await api.post('/services/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // แก้ไข service
  update: async (id, serviceData) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/services/${id}`, serviceData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // ลบ service
  delete: async (id) => {
    const token = localStorage.getItem('token');
    const response = await api.delete(`/services/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
