import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import apiClient from '@/services/apiClient'; // Import the Axios client

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ✅ Define logout before useEffect
  const logout = () => {
    localStorage.removeItem('token');
    setUserId(null);
    router.push('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decoded = jwtDecode<{ userId: string, exp: number }>(token);

        // ✅ Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("Token expired, logging out...");
          logout();
          return;
        }

        setUserId(decoded.userId);
      } catch (error) {
        console.error('Error decoding token:', error);
        logout();
      }
    }
    
    setLoading(false);
  }, []);

  // ✅ Fixed Axios login function
  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });

      if (!response.data?.token) {
        console.error("Login failed: No token received");
        return false;
      }

      localStorage.setItem('token', response.data.token);
      const decoded = jwtDecode<{ userId: string }>(response.data.token);
      setUserId(decoded.userId);

      return true;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      return false;
    }
  };

  return { userId, loading, login, logout };
}
