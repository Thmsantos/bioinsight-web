import axios from 'axios';
import { apiConfig } from './env';

const api = axios.create({
  baseURL: apiConfig.url,
  headers: {
    'Content-Type': 'application/json',
  },
});

export { api }