import React, { useState, useEffect, useMemo } from 'react';
import { Client, VehicleType } from './types';
import { api } from './api';
import Dashboard from './components/Dashboard';
import ClientProfile from './components/ClientProfile';
import Header from './components/Header';
import EditVehicleTypeModal from './components/EditVehicleTypeModal';
import { AuthProvider, useAuth } from './components/AuthContext';
import { ThemeProvider } from './components/ThemeContext';
import Login from './components/Login';
import AdminProfile from './components/AdminProfile';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { DashboardSkeleton } from './components/Dashboard';

type AddClientData = Omit<Client, 'id' | 'transactions' | 'createdAt'>;
export type SyncStatus = 'offline' | 'syncing' | 'synced';

const AppContent: React.FC = () => {
  const { name, phone } = useParams<{ name: string, phone: string }>();
  const navigate = useNavigate();
  // Background refresh interval (ms)
  const REFRESH_INTERVAL = 30000;
  // Track if background refresh is running
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [clients, setClients] = useState<Client[]>(() => {
    const cached = localStorage.getItem('clients');
    return cached ? JSON.parse(cached) : [];
  });
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>(() => {
    const cached = localStorage.getItem('vehicleTypes');
    return cached ? JSON.parse(cached) : [];
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isEditVehicleTypeModalOpen, setIsEditVehicleTypeModalOpen] = useState(false);
  const [vehicleTypeToEdit, setVehicleTypeToEdit] = useState<VehicleType | null>(null);

  // Background data refresh effect (only runs after initial data is loaded)
  useEffect(() => {
    if (!isAuthenticated || !isDataLoaded) return;
    let isFetching = false;
    const interval = setInterval(async () => {
      if (isFetching) return;
      isFetching = true;
      setIsRefreshing(true);
      try {
        const [clientsData, vehicleTypesData] = await Promise.all([
          api.getClients(),
          api.getVehicleTypes()
        ]);
        setClients(clientsData);
        setVehicleTypes(vehicleTypesData);
      } catch (error) {
        console.error('Background refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        isFetching = false;
      }
    }, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [isAuthenticated, isDataLoaded]);

  // Effect to handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load data from API only once after authentication
  useEffect(() => {
    console.log('AppContent useEffect: isAuthenticated', isAuthenticated);
    if (!isAuthenticated) {
      setIsDataLoaded(false);
      setLoadError(null);
      return;
    }
    if (isDataLoaded) {
      console.log('Data already loaded, skipping fetch.');
      return;
    }
    const loadData = async () => {
      try {
        setLoadError(null);
        // Fetch clients and vehicle types in parallel
        const [clientsData, vehicleTypesData] = await Promise.all([
          api.getClients(),
          api.getVehicleTypes()
        ]);
        console.log('Clients fetched:', clientsData);
        console.log('Vehicle types fetched:', vehicleTypesData);
        setClients(clientsData);
        setVehicleTypes(vehicleTypesData);
        setIsDataLoaded(true);
        console.log('Data loaded successfully.');
      } catch (error) {
        console.error('Failed to fetch data:', error);
        let errorMsg = 'Failed to fetch data.';
        if (error instanceof Error && error.message) {
          errorMsg = error.message;
        }
        setLoadError(errorMsg);
        // If error is 401 Unauthorized, log out and show login page
        if (error instanceof Error && error.message && error.message.includes('401')) {
          logout();
          setIsDataLoaded(false);
        }
      }
    };
    loadData();
  }, [isAuthenticated, isDataLoaded, logout]);

  // Sync status based on online status
  useEffect(() => {
    if (!isDataLoaded) return;
    setSyncStatus(isOnline ? 'synced' : 'offline');
  }, [isOnline, isDataLoaded]);

  // Optimistic UI update for adding client
  const addClient = async (clientData: AddClientData) => {
    try {
      const newClient = await api.createClient(clientData);
      setClients(prevClients => [...prevClients, newClient]);
    } catch (error) {
      console.error('Failed to add client:', error);
    }
  };

  // Optimistic UI update for editing client
  const updateClient = async (updatedClient: Client) => {
    setClients(prevClients =>
      prevClients.map(client => client.id === updatedClient.id ? updatedClient : client)
    );
    try {
      const savedClient = await api.updateClient(updatedClient.id, updatedClient);
      setClients(prevClients =>
        prevClients.map(client => client.id === updatedClient.id ? savedClient : client)
      );
    } catch (error) {
      console.error('Failed to update client', error);
    }
  };

  // Optimistic UI update for deleting client
  const deleteClient = async (clientId: string) => {
    setClients(prevClients => prevClients.filter(client => client.id !== clientId));
    try {
      await api.deleteClient(clientId);
    } catch (error) {
      console.error('Failed to delete client', error);
      // Revert optimistic update if failed
      const cached = localStorage.getItem('clients');
      if (cached) {
        setClients(JSON.parse(cached));
      }
    }
  };

  // Optimistic UI update for adding vehicle type
  const addVehicleType = async (name: string, chargingFee: number) => {
    const optimisticVehicleType: VehicleType = {
      id: `temp-vt-${Date.now()}`,
      name,
      chargingFee,
    };
    setVehicleTypes(prev => [...prev, optimisticVehicleType]);
    try {
      const newVehicleType = await api.createVehicleType({ name, chargingFee });
      setVehicleTypes(prev => prev.map(vt => vt.id === optimisticVehicleType.id ? newVehicleType : vt));
    } catch (error) {
      console.error('Failed to add vehicle type', error);
      setVehicleTypes(prev => prev.filter(vt => vt.id !== optimisticVehicleType.id));
    }
  };

  const selectedClient = useMemo(() => {
    if (!name || !phone) return null;
    return clients.find(client => client.name === decodeURIComponent(name) && client.phone === phone) || null;
  }, [clients, name, phone]);

  const handleSelectClient = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (client) {
      navigate(`/client/${encodeURIComponent(client.name)}/${client.phone}`);
    }
  };

  const handleEditVehicleType = (vehicleType: VehicleType) => {
    setVehicleTypeToEdit(vehicleType);
    setIsEditVehicleTypeModalOpen(true);
  };

  // Optimistic UI update for editing vehicle type
  const updateVehicleType = async (updatedVehicleType: VehicleType) => {
    setVehicleTypes(prev => prev.map(vt => vt.id === updatedVehicleType.id ? updatedVehicleType : vt));
    try {
      const savedVehicleType = await api.updateVehicleType(updatedVehicleType.id, updatedVehicleType);
      setVehicleTypes(prev => prev.map(vt => vt.id === savedVehicleType.id ? savedVehicleType : vt));
    } catch (error) {
      console.error('Failed to update vehicle type', error);
    }
  };

  const deleteVehicleType = async (id: string) => {
    const isUsed = clients.some(client => client.vehicleTypeId === id);
    if (isUsed) {
      alert('Cannot delete vehicle type as it is assigned to one or more clients.');
      return;
    }
    try {
      await api.deleteVehicleType(id);
      setVehicleTypes(prev => prev.filter(vt => vt.id !== id));
    } catch (error) {
      console.error('Failed to delete vehicle type', error);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!isDataLoaded) {
    return <DashboardSkeleton />;
  }
  if (showAdminProfile) {
    return <AdminProfile />;
  }

  if ((name || phone) && !selectedClient && isDataLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <Header
          onAdminProfile={() => setShowAdminProfile(true)}
        />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Client not found</h2>
            <p className="text-gray-600 dark:text-gray-400">The client you're looking for does not exist.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Go to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Header
        onAdminProfile={() => setShowAdminProfile(true)}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {selectedClient ? (
          <ClientProfile
            client={selectedClient}
            vehicleTypes={vehicleTypes}
            onBack={() => navigate('/')}
            onUpdateClient={updateClient}
            onDeleteClient={deleteClient}
          />
        ) : (
          <>
            <Dashboard
              clients={clients}
              onSelectClient={handleSelectClient}
              onAddClient={addClient}
              vehicleTypes={vehicleTypes}
              onAddVehicleType={addVehicleType}
              onEditVehicleType={handleEditVehicleType}
              onDeleteVehicleType={deleteVehicleType}
            />
            {(!isDataLoaded || isRefreshing) && (
              <div className="flex items-center mt-4">
                <svg className="animate-spin h-5 w-5 mr-2 text-blue-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span className="text-gray-500">Updating data...</span>
              </div>
            )}
          </>
        )}
      </main>
      {isEditVehicleTypeModalOpen && vehicleTypeToEdit && (
        <EditVehicleTypeModal
          vehicleType={vehicleTypeToEdit}
          onClose={() => setIsEditVehicleTypeModalOpen(false)}
          onUpdateVehicleType={(updatedVehicleType) => {
            updateVehicleType(updatedVehicleType);
            setIsEditVehicleTypeModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

const AppWithRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/" element={<AppContent />} />
        <Route path="/client/:name/:phone" element={<AppContent />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        {/* Add more routes here, e.g. /profile, /settings, etc. */}
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppWithRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
