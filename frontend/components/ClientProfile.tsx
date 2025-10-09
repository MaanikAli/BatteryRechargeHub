import React, { useState, useMemo } from 'react';
import { Client, VehicleType, Transaction } from '../types';
import { ArrowLeftIcon, PlusIcon, ReceiptIcon, UserIcon, PencilIcon, TrashIcon } from './Icons';
import EditClientModal from './EditClientModal';
import EditVehicleTypeModal from './EditVehicleTypeModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditTransactionModal from './EditTransactionModal';
import { api } from '../api';

interface ClientProfileProps {
  client: Client;
  vehicleTypes: VehicleType[];
  onBack: () => void;
  onUpdateClient: (client: Client) => void;
}

const AddTransactionForm: React.FC<{ client: Client; vehicleTypes: VehicleType[]; onAddTransaction: (tx: Omit<Transaction, 'id'>) => void }> = ({ client, vehicleTypes, onAddTransaction }) => {
    const [cashReceived, setCashReceived] = useState<string>('');

    const vehicleType = vehicleTypes.find(vt => vt.id === client.vehicleTypeId);
    const payableAmount = vehicleType ? vehicleType.chargingFee : 0;
    const cash = Number(cashReceived) || 0;
    const due = payableAmount - cash;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTransaction({
            timestamp: new Date().toISOString(),
            vehicleTypeId: client.vehicleTypeId, // Automatically set from profile
            payableAmount,
            cashReceived: cash,
            due,
        });
        setCashReceived('');
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-md space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><PlusIcon/> Add New Transaction</h3>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Vehicle Type</label>
                <div className="mt-1 flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-md text-slate-500 dark:text-slate-400">
                    {vehicleType ? vehicleType.name : 'N/A'}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Payable Amount</label>
                <div className="mt-1 flex items-center px-3 py-2 bg-slate-100 dark:bg-slate-700/50 rounded-md text-slate-500 dark:text-slate-400">
                    ৳{payableAmount.toLocaleString()}
                </div>
            </div>
            <div>
                <label htmlFor="cashReceived" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cash Received</label>
                <input type="number" id="cashReceived" value={cashReceived} onChange={e => setCashReceived(e.target.value)} placeholder="0" className="mt-1 block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
            </div>
            <div className="flex justify-between items-center text-sm p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
                <span className="font-medium text-indigo-800 dark:text-indigo-300">Current Due:</span>
                <span className={`font-bold text-lg ${due > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>৳{due.toLocaleString()}</span>
            </div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
                Save Transaction
            </button>
        </form>
    );
};


const ClientProfile: React.FC<ClientProfileProps> = ({ client, vehicleTypes, onBack, onUpdateClient }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEditVehicleTypeModalOpen, setIsEditVehicleTypeModalOpen] = useState(false);
    const [vehicleTypeToEdit, setVehicleTypeToEdit] = useState<VehicleType | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
    const [isEditTransactionModalOpen, setIsEditTransactionModalOpen] = useState(false);
    const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);
    const [sortKey, setSortKey] = useState<'timestamp' | 'payableAmount' | 'cashReceived' | 'due'>('timestamp');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const totalDue = useMemo(() => {
        const netDue = client.transactions.reduce((acc, tx) => acc + tx.due, 0);
        return Math.max(0, netDue);
    }, [client.transactions]);

    const sortedTransactions = useMemo(() => {
        let sorted = [...client.transactions];
        sorted = sorted.sort((a, b) => {
            let aVal, bVal;
            if (sortKey === 'timestamp') {
                aVal = new Date(a.timestamp).getTime();
                bVal = new Date(b.timestamp).getTime();
            } else {
                aVal = a[sortKey];
                bVal = b[sortKey];
            }
            if (sortOrder === 'asc') {
                return aVal - bVal;
            } else {
                return bVal - aVal;
            }
        });
        return sorted;
    }, [client.transactions, sortKey, sortOrder]);

    const handleAddTransaction = async (newTxData: Omit<Transaction, 'id'>) => {
        try {
            const updatedClient = await api.addTransaction(client.id, { timestamp: newTxData.timestamp, cashReceived: newTxData.cashReceived });
            onUpdateClient(updatedClient);
        } catch (error) {
            console.error('Failed to add transaction:', error);
        }
    };

    const handleUpdateTransaction = async (txId: string, updates: Partial<Transaction>) => {
        try {
            const updatedClient = await api.updateTransaction(client.id, txId, updates);
            onUpdateClient(updatedClient);
        } catch (error) {
            console.error('Failed to update transaction:', error);
        }
    };

    const handleDeleteTransaction = (txId: string) => {
        setTransactionToDelete(txId);
        setIsDeleteModalOpen(true);
    };

    const confirmDeleteTransaction = async () => {
        if (!transactionToDelete) return;
        try {
            const updatedClient = await api.deleteTransaction(client.id, transactionToDelete);
            onUpdateClient(updatedClient);
        } catch (error) {
            console.error('Failed to delete transaction:', error);
        }
        setTransactionToDelete(null);
    };

    const handleEditTransactionUpdate = (updates: Partial<Transaction>) => {
        if (!transactionToEdit) return;
        handleUpdateTransaction(transactionToEdit.id, updates);
        setIsEditTransactionModalOpen(false);
        setTransactionToEdit(null);
    };
    
    const primaryVehicle = useMemo(() => {
        return vehicleTypes.find(vt => vt.id === client.vehicleTypeId)?.name || 'N/A';
    }, [client.vehicleTypeId, vehicleTypes]);

    const handleEditVehicleType = (vehicleType: VehicleType) => {
        setVehicleTypeToEdit(vehicleType);
        setIsEditVehicleTypeModalOpen(true);
    };

    return (
        <>
            <div className="space-y-6">
                <button onClick={onBack} className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
                    <ArrowLeftIcon />
                    Back to Dashboard
                </button>

                <div className="bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        {client.imageUrl ? (
                            <img src={client.imageUrl} alt={client.name} className="h-24 w-24 rounded-full object-cover border-4 border-white dark:border-slate-700 shadow-md"/>
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-md">
                               <UserIcon className="h-12 w-12 text-slate-500" />
                            </div>
                        )}
                        <div className="flex-1">
                             <div className="flex justify-between items-start">
                                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{client.name}</h2>
                                <button 
                                    onClick={() => setIsEditModalOpen(true)}
                                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/50 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900"
                                >
                                    <PencilIcon />
                                    <span>Edit</span>
                                </button>
                            </div>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-600 dark:text-slate-400">
                               <p><span className="font-semibold text-slate-700 dark:text-slate-300">Father's Name:</span> {client.fatherName || 'N/A'}</p>
                               <p><span className="font-semibold text-slate-700 dark:text-slate-300">Phone:</span> {client.phone}</p>
                               <p><span className="font-semibold text-slate-700 dark:text-slate-300">NID No:</span> {client.nid || 'N/A'}</p>
                               <p><span className="font-semibold text-slate-700 dark:text-slate-300">Vehicle Type:</span> {primaryVehicle}</p>
                               <p className="sm:col-span-2"><span className="font-semibold text-slate-700 dark:text-slate-300">Address:</span> {client.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                     <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex justify-between items-center">
                        <span className="font-semibold text-red-800 dark:text-red-300">Total Outstanding Due</span>
                        <span className="text-2xl font-bold text-red-600 dark:text-red-400">৳{totalDue.toLocaleString()}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <AddTransactionForm client={client} vehicleTypes={vehicleTypes} onAddTransaction={handleAddTransaction} />
                    </div>

                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 shadow-md rounded-lg p-6">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><ReceiptIcon /> Transaction History</h3>
                        <div className="flex flex-wrap gap-2 mb-4">
                            <label className="font-medium text-slate-700 dark:text-slate-300">Sort by:</label>
                            <select
                                value={sortKey}
                                onChange={e => setSortKey(e.target.value as 'timestamp' | 'payableAmount' | 'cashReceived' | 'due')}
                                className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                            >
                                <option value="timestamp">Date</option>
                                <option value="payableAmount">Payable Amount</option>
                                <option value="cashReceived">Cash Received</option>
                                <option value="due">Due</option>
                            </select>
                            <button
                                type="button"
                                onClick={() => setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
                                className="px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                            >
                                {sortOrder === 'asc' ? 'Asc' : 'Desc'}
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                              <thead className="bg-slate-50 dark:bg-slate-700/50">
                                  <tr>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date</th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Payable</th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Cash</th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Due</th>
                                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                                  </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                  {sortedTransactions.length > 0 ? sortedTransactions.map(tx => (
                                      <tr key={tx.id}>
                                          <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                                              {new Date(tx.timestamp).toLocaleString()}
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-800 dark:text-slate-200">
                                              ৳{tx.payableAmount.toLocaleString()}
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">
                                              ৳{tx.cashReceived.toLocaleString()}
                                          </td>
                                          <td className={`px-4 py-4 whitespace-nowrap text-sm font-bold ${tx.due > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-500'}`}>
                                              ৳{tx.due.toLocaleString()}
                                          </td>
                                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                              <button onClick={() => {
                                                  setTransactionToEdit(tx);
                                                  setIsEditTransactionModalOpen(true);
                                              }} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 mr-2">Edit</button>
                                              <button onClick={() => handleDeleteTransaction(tx.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"><TrashIcon /></button>
                                          </td>
                                      </tr>
                                  )) : (
                                    <tr>
                                      <td colSpan={5} className="text-center py-10 text-slate-500 dark:text-slate-400">No transactions yet.</td>
                                    </tr>
                                  )}
                              </tbody>
                          </table>
                        </div>
                    </div>
                </div>
            </div>
            {isEditModalOpen && (
                <EditClientModal
                    client={client}
                    vehicleTypes={vehicleTypes}
                    onClose={() => setIsEditModalOpen(false)}
                    onUpdateClient={(updatedClient) => {
                        onUpdateClient(updatedClient);
                        setIsEditModalOpen(false);
                    }}
                />
            )}
            {isEditVehicleTypeModalOpen && vehicleTypeToEdit && (
                <EditVehicleTypeModal
                    vehicleType={vehicleTypeToEdit}
                    onClose={() => setIsEditVehicleTypeModalOpen(false)}
                    onUpdateVehicleType={(updatedVehicleType) => {
                        onUpdateClient({
                            ...client,
                            vehicleTypeId: updatedVehicleType.id
                        });
                        setIsEditVehicleTypeModalOpen(false);
                    }}
                />
            )}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDeleteTransaction}
                title="Delete Transaction"
                message="Are you sure you want to delete this transaction? This action cannot be undone."
            />
            {transactionToEdit && (
                <EditTransactionModal
                    isOpen={isEditTransactionModalOpen}
                    onClose={() => setIsEditTransactionModalOpen(false)}
                    onUpdate={handleEditTransactionUpdate}
                    transaction={transactionToEdit}
                    vehicleTypes={vehicleTypes}
                />
            )}
        </>
    );
};

export default ClientProfile;