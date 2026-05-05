'use client';

import axios, { AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { Config } from '../lib/config';

/**
 * Client-side API
 *
 * Cookie'da saqlangan token bilan ishlaydi.
 * Server tomonida ishlatiladigan alohida apiServer.ts bor.
 */
const api = axios.create({
  baseURL: Config.API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get(Config.STORAGE.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error: AxiosError<any>) => {
    if (error.response?.status === 401) {
      Cookies.remove(Config.STORAGE.TOKEN);
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'Noma\'lum xatolik';

    return Promise.reject({
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default api;
