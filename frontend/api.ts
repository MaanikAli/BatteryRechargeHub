import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://batteryrechargehubbackend.onrender.com/api', // Adjust the baseURL as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add a response interceptor to handle 401 errors by logging out
apiClient.interceptors.response.use((response) => {
  return response;
}, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/'; // Redirect to login
  }
  return Promise.reject(error);
});

export const api = {
  // Auth
  login: async (username: string, password: string) => {
    const response = await apiClient.post('/auth/login', { username, password });
    return response.data; // Should contain token
  },

  updateCredentials: async (currentPassword: string, newUsername: string, newPassword: string) => {
    const response = await apiClient.put('/auth/update', { currentPassword, newUsername, newPassword });
    return response.data;
  },

  // Clients
  getClients: async () => {
    const response = await apiClient.get('/clients');
    return response.data;
  },

  getClientById: async (id: string) => {
    const response = await apiClient.get(`/clients/${id}`);
    return response.data;
  },

  createClient: async (clientData: any) => {
    const response = await apiClient.post('/clients', clientData);
    return response.data;
  },

  updateClient: async (id: string, clientData: any) => {
    const response = await apiClient.put(`/clients/${id}`, clientData);
    return response.data;
  },

  deleteClient: async (id: string) => {
    const response = await apiClient.delete(`/clients/${id}`);
    return response.data;
  },

  addTransaction: async (clientId: string, transactionData: any) => {
    const response = await apiClient.post(`/clients/${clientId}/transactions`, transactionData);
    return response.data;
  },

  updateTransaction: async (clientId: string, txId: string, updates: any) => {
    const response = await apiClient.put(`/clients/${clientId}/transactions/${txId}`, updates);
    return response.data;
  },

  deleteTransaction: async (clientId: string, txId: string) => {
    const response = await apiClient.delete(`/clients/${clientId}/transactions/${txId}`);
    return response.data;
  },

  // Vehicle Types
  getVehicleTypes: async () => {
    const response = await apiClient.get('/vehicleTypes');
    return response.data;
  },

  createVehicleType: async (vehicleTypeData: any) => {
    const response = await apiClient.post('/vehicleTypes', vehicleTypeData);
    return response.data;
  },

  updateVehicleType: async (id: string, vehicleTypeData: any) => {
    const response = await apiClient.put(`/vehicleTypes/${id}`, vehicleTypeData);
    return response.data;
  },

  deleteVehicleType: async (id: string) => {
    const response = await apiClient.delete(`/vehicleTypes/${id}`);
    return response.data;
  },

  getTransactions: async (params: { page?: number; limit?: number; sortBy?: string; sortOrder?: string } = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.limit) query.append('limit', params.limit.toString());
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);
    const response = await apiClient.get(`/clients/transactions?${query.toString()}`);
    return response.data;
  },

  // Trash
  getTrash: async () => {
    const response = await apiClient.get('/clients/trash');
    return response.data;
  },

  restoreFromTrash: async (id: string) => {
    const response = await apiClient.put(`/clients/trash/${id}/restore`);
    return response.data;
  },

  restoreTransactionFromTrash: async (txId: string) => {
    const response = await apiClient.put(`/clients/trash/transactions/${txId}/restore`);
    return response.data;
  },

  permanentDeleteFromTrash: async (id: string) => {
    const response = await apiClient.delete(`/clients/trash/${id}`);
    return response.data;
  },
};
