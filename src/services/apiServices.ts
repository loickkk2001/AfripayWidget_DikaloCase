import axios from 'axios';

// Configuration de base
const API_CONFIG = {
  CASH_IN_URL: process.env.NEXT_PUBLIC_CASH_IN_URL || '',
  BALANCE_URL: process.env.NEXT_PUBLIC_BALANCE_URL || '',
};

// Vérifier que les variables d'environnement sont définies
if (!API_CONFIG.CASH_IN_URL || !API_CONFIG.BALANCE_URL) {
  console.error('Variables d\'environnement manquantes pour l\'API');
}

// Configurer axios avec des valeurs par défaut
const apiClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add request interceptor to include token in every request
apiClient.interceptors.request.use(
  (config) => {
    // Try user authentication token first
    const userToken = localStorage.getItem('token');

    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    } else {
      // Fall back to the API bearer token for unauthenticated API calls
      const apiToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;
      if (apiToken) {
        config.headers.Authorization = `Bearer ${apiToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interface pour les données de cash-in
interface CashInData {
  amount: number;
  currency: string;
  phoneNumber: string;
  paymentMethod: string;
  reference?: string;
  userId?: string; // ✅ Ajout de userId
}

// Interface pour la réponse de cash-in
interface CashInResponse {
  transactionId: string;
  status: string;
  amount: number; // ✅ Ensure amount is included
}

// Interface pour la réponse de solde
interface BalanceResponse {
  balance: number;
  currency: string;
  lastUpdated: string;
}

/**
 * Service pour les opérations financières
 */
export const FinanceService = {
  /**
   * Effectue une opération de cash-in
   */
  processCashIn: async (data: CashInData): Promise<CashInResponse> => {
    try {
      const response = await apiClient.post(API_CONFIG.CASH_IN_URL, data);

      // ✅ Ensure the response includes the amount property
      if (!response.data.amount) {
        throw new Error('Invalid response: amount is missing');
      }

      return response.data;
    } catch (error) {
      console.error('Erreur lors du cash-in:', error);
      throw error;
    }
  },

  /**
   * Récupère le solde du compte
   */
  getBalance: async (userId?: string): Promise<BalanceResponse> => {
    try {
      // Check if token exists before making the request
      if (!localStorage.getItem('token')) {
        throw new Error('Authentication token not found');
      }

      const url = userId
        ? `${API_CONFIG.BALANCE_URL}/${userId}`
        : API_CONFIG.BALANCE_URL;

      const response = await apiClient.get(url);

      // ✅ Ensure the response includes the balance property
      if (typeof response.data.balance !== 'number') {
        throw new Error('Invalid response: balance is missing or not a number');
      }

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du solde:', error);

      // Log more details about the error
      if (axios.isAxiosError(error)) {
        console.log('Request URL:', error.config?.url);
        console.log('Response status:', error.response?.status);
        console.log('Response data:', error.response?.data);

        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401) {
          // Clear invalid token
          localStorage.removeItem('token');

          // If running in browser context, redirect to login
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }
      throw error;
    }
  },

  /**
   * Vérifie le statut d'une transaction
   */
  checkTransactionStatus: async (transactionId: string): Promise<CashInResponse> => {
    try {
      const response = await apiClient.get(`${API_CONFIG.CASH_IN_URL}/status/${transactionId}`);

      // ✅ Ensure the response includes the amount property
      if (!response.data.amount) {
        throw new Error('Invalid response: amount is missing');
      }

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
      throw error;
    }
  },
};