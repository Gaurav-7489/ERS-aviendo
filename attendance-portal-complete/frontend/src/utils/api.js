// src/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, // send cookies automatically
});


// Add auth token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token'); // store JWT after login
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
