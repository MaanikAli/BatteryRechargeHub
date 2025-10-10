import React, { useState, useMemo, memo } from 'react';
import { Client, VehicleType } from '../types';
import { PlusIcon, UserIcon, SearchIcon, TrashIcon } from './Icons';
import AddClientModal from './AddClientModal';
import AddVehicleTypeModal from './AddVehicleTypeModal';
import DeleteConrmationModal from './DeleteConfirmationModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// The data structure for creating a new client, excluding server-generated fields
type AddClientData = Omit<Client, 'id' | 'transactions' | 'createdAt'>;

interface DashboardProps {
  clients: Client[];
  vehicleTypes: VehicleType[];
  onSelectClient: (clientId: string) => void;
  onAddClient: (clientData: AddClientData) => void;
  onAddVehicleType: (name: string, chargingFee: number) => void;
  onEditVehicleType: (vehicleType: VehicleType) => void;
  onDeleteVehicleType: (id: string) => void;
}

// Pagination page size constant (used by both Dashboard and DashboardSkeleton)
export const PAGE_SIZE = 5;

const Dashboard: React.FC<DashboardProps> = memo(({ clients, vehicleTypes, onSelectClient, onAddClient, onAddVehicleType, onEditVehicleType, onDeleteVehicleType }) => {
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [vehicleTypeToDelete, setVehicleTypeToDelete] = useState<VehicleType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState<'name' | 'createdAt' | 'due'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredClients = useMemo(() => {
    let result = clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    );
    // Sorting logic
    result = result.sort((a, b) => {
      if (sortKey === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortKey === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortKey === 'due') {
        const aDue = a.transactions.reduce((sum, tx) => sum + Math.max(0, tx.due), 0);
        const bDue = b.transactions.reduce((sum, tx) => sum + Math.max(0, tx.due), 0);
        return sortOrder === 'asc' ? aDue - bDue : bDue - aDue;
      }
      return 0;
    });
    return result;
  }, [clients, searchTerm, sortKey, sortOrder]);
  
  const totalDueAllClients = useMemo(() => {
      return clients.reduce((total, client) => {
          return total + client.transactions.reduce((sum, tx) => sum + tx.due, 0);
      }, 0);
  }, [clients]);

  const chartData = useMemo(() => {
    return clients.map(client => ({
      name: client.name.length > 10 ? client.name.substring(0, 10) + '...' : client.name,
      due: client.transactions.reduce((sum, tx) => sum + tx.due, 0)
    })).filter(item => item.due !== 0).slice(0, 10); // Top 10 with due > 0
  }, [clients]);

  const getBarColor = (due: number) => {
    if (due >= 500) return '#dc2626'; // red-600
    if (due >=100) return '#ea580c'; // orange-600
    if (due >= 50) return '#16a34a'; // green-600
    if (due < -1000) return '#2675dcff'; // red for large negative
    return '#16a34a'; // green for small negative or zero
  };



  const totalPages = Math.ceil(filteredClients.length / PAGE_SIZE);
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredClients.slice(start, start + PAGE_SIZE);
  }, [filteredClients, currentPage]);
  
  return (
    <>
      <div className="space-y-4">
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage clients & payments</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddVehicleModalOpen(true)}
                      className="bg-sky-500 text-white px-3 py-1 rounded-md font-medium text-xs hover:bg-sky-600 transition-colors flex items-center gap-1"
                    >
                      <PlusIcon className="w-3 h-3" />
                      Type
                    </button>
                    <button
                      onClick={() => setIsAddClientModalOpen(true)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded-md font-medium text-xs hover:bg-indigo-700 transition-colors flex items-center gap-1"
                    >
                      <PlusIcon className="w-3 h-3" />
                      Client
                    </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400">Clients</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{clients.length}</p>
            </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Due</h3>
                <p className={`text-2xl font-bold mt-1 ${totalDueAllClients >= 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>৳{totalDueAllClients.toLocaleString()}</p>
            </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md">
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400">Vehicle Types</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{vehicleTypes.length}</p>
            </div>
        </div>

        {chartData.length > 0 && (
          <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Client Dues Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`৳${value}`, 'Due']} />
                <Bar dataKey="due">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.due)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-4">
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              <label className="font-medium text-slate-700 dark:text-slate-300">Sort by:</label>
              <select
                value={sortKey}
                onChange={e => setSortKey(e.target.value as 'name' | 'createdAt' | 'due')}
                className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              >
                <option value="createdAt">Created Date</option>
                <option value="name">Name</option>
                <option value="due">Total Due</option>
              </select>
              <button
                type="button"
                onClick={() => setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
                className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              >
                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
              </button>
            </div>

            <div className="space-y-3">
              {filteredClients.length > 0 ? paginatedClients.map(client => {
                const totalDue = client.transactions.reduce((sum, tx) => sum + tx.due, 0);
                return (
                  <div key={client.id} onClick={() => onSelectClient(client.id)}
                       className="p-4 border dark:border-slate-700 rounded-lg flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                        {client.imageUrl ? (
                           <img src={client.imageUrl} alt={client.name} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
                        ) : (
                           <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded-full">
                               <UserIcon />
                           </div>
                        )}
                        <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">{client.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{client.phone}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Due</p>
                        <p className={`font-bold text-right ${totalDue > 0 ? 'text-red-500' : 'text-green-500'}`}>
                           ৳{totalDue.toLocaleString()}
                        </p>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-10 text-slate-500 dark:text-slate-400">
                    <p>No clients found.</p>
                    <p className="text-sm">Click "New Client" to add one.</p>
                </div>
              )}
            </div>
            {filteredClients.length > PAGE_SIZE && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-semibold disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >Prev</button>
                <span className="font-bold text-slate-700 dark:text-white">Page {currentPage} of {totalPages}</span>
                <button
                  className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white font-semibold disabled:opacity-50"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >Next</button>
              </div>
            )}
        </div>

        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3">Vehicle Types</h3>
            <div className="space-y-2">
              {vehicleTypes.map(vt => (
                <div key={vt.id} className="flex justify-between items-center p-2 border dark:border-slate-700 rounded">
                  <div>
                    <p className="font-medium text-sm">{vt.name}</p>
                    <p className="text-xs text-slate-500">৳{vt.chargingFee}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => onEditVehicleType(vt)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 text-sm">Edit</button>
                    <button onClick={() => {
                      setVehicleTypeToDelete(vt);
                      setIsDeleteModalOpen(true);
                    }} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm"><TrashIcon className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>

      {isAddClientModalOpen && (
        <AddClientModal 
          vehicleTypes={vehicleTypes}
          onClose={() => setIsAddClientModalOpen(false)}
          onAddClient={(clientData) => {
            onAddClient(clientData);
            setIsAddClientModalOpen(false);
          }}
        />
      )}
      {isAddVehicleModalOpen && (
          <AddVehicleTypeModal
            onClose={() => setIsAddVehicleModalOpen(false)}
            onAddVehicleType={(name, fee) => {
                onAddVehicleType(name, fee);
                setIsAddVehicleModalOpen(false);
            }}
          />
      )}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          if (vehicleTypeToDelete) {
            onDeleteVehicleType(vehicleTypeToDelete.id);
          }
          setIsDeleteModalOpen(false);
        }}
        title="Delete Vehicle Type"
        message={`Are you sure you want to delete "${vehicleTypeToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  );
});

// Skeleton loader for dashboard
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
      <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-md">
          <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      ))}
    </div>
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
      <div className="h-10 w-full bg-slate-200 dark:bg-slate-700 rounded mb-4" />
      {[...Array(PAGE_SIZE)].map((_, i) => (
        <div key={i} className="h-16 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2" />
      ))}
    </div>
    <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
      <div className="h-6 w-1/4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-8 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2" />
      ))}
    </div>
  </div>
);

export default Dashboard;