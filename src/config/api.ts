import axios from 'axios';
import { apiConfig } from './env';
import { storage } from '@/utils/storage';

const api = axios.create({
  baseURL: apiConfig.url,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = storage.get<string>('token');
  if (token) { config.headers.Authorization = `Bearer ${token}`; }
  return config;
})

export { api }
