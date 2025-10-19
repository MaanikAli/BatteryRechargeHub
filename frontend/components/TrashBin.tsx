import React, { useState, useEffect } from 'react';
import { TrashIcon, ArrowPathIcon, XIcon } from './Icons';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { api } from '../api';

interface Client {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  clientId: string;
  clientName: string;
  timestamp: string;
  payableAmount: number;
  cashReceived: number;
  due: number;
  type: string;
}

interface TrashData {
  clients: Client[];
  transactions: Transaction[];
}

const TrashBin: React.FC = () => {
  const [trashData, setTrashData] = useState<TrashData>({ clients: [], transactions: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: Client | Transaction | null; type: 'client' | 'transaction' | null }>({
    isOpen: false,
    item: null,
    type: null
  });

  useEffect(() => {
    fetchTrashData();
  }, []);

  const fetchTrashData = async () => {
    try {
      const data = await api.getTrash();
      setTrashData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await api.restoreFromTrash(id);
      await fetchTrashData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore item');
    }
  };

  const handleRestoreTransaction = async (txId: string) => {
    try {
      await api.restoreTransactionFromTrash(txId);
      await fetchTrashData(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore transaction');
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await api.permanentDeleteFromTrash(id);
      await fetchTrashData(); // Refresh data
      setDeleteModal({ isOpen: false, item: null, type: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to permanently delete item');
    }
  };

  const openDeleteModal = (item: Client | Transaction, type: 'client' | 'transaction') => {
    setDeleteModal({ isOpen: true, item, type });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, item: null, type: null });
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <TrashIcon className="h-8 w-8" />
        Trash Bin
      </h1>

      {/* Clients Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Deleted Clients</h2>
        {trashData.clients.length === 0 ? (
          <p className="text-gray-500">No deleted clients</p>
        ) : (
          <div className="space-y-4">
            {trashData.clients.map(client => (
              <div key={client.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{client.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{client.phone}</p>
                    <p className="text-xs text-gray-500">Created: {new Date(client.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestore(client.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      Restore
                    </button>
                    <button
                      onClick={() => openDeleteModal(client, 'client')}
                      className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <XIcon className="h-4 w-4" />
                      Delete Forever
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transactions Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Deleted Transactions</h2>
        {trashData.transactions.length === 0 ? (
          <p className="text-gray-500">No deleted transactions</p>
        ) : (
          <div className="space-y-4">
            {trashData.transactions.map(transaction => (
              <div key={transaction.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow border">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{transaction.clientName}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.type} - ${transaction.payableAmount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestoreTransaction(transaction.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      Restore Transaction
                    </button>
                    <button
                      onClick={() => openDeleteModal(transaction, 'transaction')}
                      className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      <XIcon className="h-4 w-4" />
                      Delete Forever
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => deleteModal.item && handlePermanentDelete(deleteModal.item.id)}
        title="Permanently Delete Item"
        message={`Are you sure you want to permanently delete this ${deleteModal.type}? This action cannot be undone.`}
        confirmButtonText="Delete Forever"
      />
    </div>
  );
};

export default TrashBin;
