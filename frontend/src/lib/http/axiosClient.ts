import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

/**
 * Sinh mã Idempotency-Key (UUID v4) cho các request quan trọng (Đặt hàng, Thanh toán VNPay/MoMo)
 * giúp Backend chặn đứng tình trạng double-click hoặc retry gây trừ tiền 2 lần.
 */
export const generateIdempotencyKey = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const axiosClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('roastrush_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Tự động gắn X-Idempotency-Key cho các mutation POST/PUT nếu chưa truyền
    if (
      config.method &&
      ['post', 'put', 'patch'].includes(config.method.toLowerCase()) &&
      config.headers &&
      !config.headers['X-Idempotency-Key']
    ) {
      config.headers['X-Idempotency-Key'] = generateIdempotencyKey();
    }

    return config;
  },
  (error) => Promise.reject(error)
);

