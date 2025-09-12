import axios from 'axios';
import type { AxiosInstance } from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL as string;

if (!baseURL) {
  throw new Error('NEXT_PUBLIC_BACKEND_URL is not defined');
}

const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export default api;