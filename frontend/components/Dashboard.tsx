import React, { useState, useMemo } from 'react';
import { Client, VehicleType } from '../types';
import { PlusIcon, UserIcon, SearchIcon, TrashIcon } from './Icons';
import AddClientModal from './AddClientModal';
import AddVehicleTypeModal from './AddVehicleTypeModal';

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

const Dashboard: React.FC<DashboardProps> = ({ clients, vehicleTypes, onSelectClient, onAddClient, onAddVehicleType, onEditVehicleType, onDeleteVehicleType }) => {
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);
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

  const totalPages = Math.ceil(filteredClients.length / PAGE_SIZE);
  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredClients.slice(start, start + PAGE_SIZE);
  }, [filteredClients, currentPage]);
  
  return (
    <>
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Client Dashboard</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all your clients and their payments.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddVehicleModalOpen(true)}
                      className="bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-sky-600 transition-colors flex items-center gap-2"
                    >
                      <PlusIcon />
                      Vehicle Type
                    </button>
                    <button
                      onClick={() => setIsAddClientModalOpen(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                      <PlusIcon />
                      New Client
                    </button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Clients</h3>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{clients.length}</p>
            </div>
             <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Outstanding Due</h3>
                <p className={`text-3xl font-bold mt-1 ${totalDueAllClients >= 0 ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}>৳{totalDueAllClients.toLocaleString()}</p>
            </div>
             <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-md">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">Vehicle Types</h3>
                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{vehicleTypes.length}</p>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
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
                           <img src={client.imageUrl} alt={client.name} className="h-12 w-12 rounded-full object-cover" />
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

        <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Vehicle Types</h3>
            <div className="space-y-2">
              {vehicleTypes.map(vt => (
                <div key={vt.id} className="flex justify-between items-center p-3 border dark:border-slate-700 rounded">
                  <div>
                    <p className="font-semibold">{vt.name}</p>
                    <p className="text-sm text-slate-500">৳{vt.chargingFee}</p>
                  </div>
                  <button onClick={() => onEditVehicleType(vt)} className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 mr-2">Edit</button>
                  <button onClick={() => onDeleteVehicleType(vt.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"><TrashIcon /></button>
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
    </>
  );
};

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