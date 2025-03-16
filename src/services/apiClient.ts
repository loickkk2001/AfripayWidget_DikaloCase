import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://66.29.131.68:8101/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-PARTNER-ID': 'DIKALO',
    'X-PARTNER-SECRET': 'DIKALO_SECRET',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    // Handle API errors
    const message = error.response.data?.message || error.response.data?.error || 'An error occurred. Please try again.';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
