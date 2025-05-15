import axios from 'axios';

// Set the base URL from environment variable or fallback
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
axios.defaults.timeout = 15000;

// --- REQUEST INTERCEPTOR ---
axios.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('vending_machine_accesstoken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- GENERIC API REQUEST FUNCTION ---
export const makeApiRequest = (endpoint, method, data, options = {}) => {
  const { onSuccess, onError, ...axiosOptions } = options;

  return axios({
    url: endpoint,
    method,
    data,
    ...axiosOptions,
  })
    .then((response) => {
      if (typeof onSuccess === 'function') {
        onSuccess(response);
      }
      if (process.env.NODE_ENV === 'development') {
        // console.log('✅ API Response:', response);
      }
      return response;
    })
    .catch((error) => {
      const formattedError = {
        status: error?.response?.status,
        message:
          error?.response?.data?.message || error?.message || 'Unknown Error',
        data: error?.response?.data,
      };

      if (typeof onError === 'function') {
        onError(formattedError);
      }
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ API Error:', formattedError);
      }

      throw formattedError;
    });
};
