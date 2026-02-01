import axios from 'axios';

const api = axios.create({
  baseURL: 'https://mern-rental-2.onrender.com/api', // ปรับตาม backend ของคุณ
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api; // ✅ export default
