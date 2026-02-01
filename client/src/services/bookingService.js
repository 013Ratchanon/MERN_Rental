import api from './api';

export const bookingService = {
  getAll: async () => {
    const token = localStorage.getItem('token');
    const response = await api.get('/bookings', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getById: async (id) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/bookings/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getByCustomerName: async (customerName) => {
    const token = localStorage.getItem('token');
    const response = await api.get(`/bookings/customer/${customerName}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  create: async (bookingData) => {
    const token = localStorage.getItem('token');
    const response = await api.post('/bookings/create', bookingData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  updateStatus: async (id, status) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/bookings/${id}/status`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  cancel: async (id) => {
    const token = localStorage.getItem('token');
    const response = await api.put(`/bookings/${id}/status`, { status: 'cancelled' }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};
