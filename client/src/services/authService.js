import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data; // { _id, username, email, role, token }
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data; // { _id, username, email, role, token }
  },

  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data; // { user: { ... } }
  },
};
