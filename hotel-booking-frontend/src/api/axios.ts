import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://wisflux-hotel-service.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;


