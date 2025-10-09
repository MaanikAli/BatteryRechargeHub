import React, { useState, useEffect } from 'react';
import { PencilIcon, XIcon } from './Icons';
import { Transaction, VehicleType } from '../types';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<Transaction>) => void;
  transaction: Transaction;
  vehicleTypes: VehicleType[];
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  transaction,
  vehicleTypes
}) => {
  const [cashReceived, setCashReceived] = useState<string>(transaction.cashReceived.toString());

  useEffect(() => {
    if (isOpen) {
      setCashReceived(transaction.cashReceived.toString());
    }
  }, [isOpen, transaction.cashReceived]);

  const vehicleType = vehicleTypes.find(vt => vt.id === transaction.vehicleTypeId);
  const payableAmount = transaction.payableAmount;
  const cash = Number(cashReceived) || 0;
  const due = payableAmount - cash;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cash = Number(cashReceived);
    if (!isNaN(cash) && cash >= 0) {
      onUpdate({ cashReceived: cash });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PencilIcon />
            Edit Transaction
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <XIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
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
              <input
                type="number"
                id="cashReceived"
                value={cashReceived}
                onChange={e => setCashReceived(e.target.value)}
                placeholder="0"
                min="0"
                className="mt-1 block w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div className="flex justify-between items-center text-sm p-3 bg-indigo-50 dark:bg-indigo-900/50 rounded-lg">
              <span className="font-medium text-indigo-800 dark:text-indigo-300">Current Due:</span>
              <span className={`font-bold text-lg ${due > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>৳{due.toLocaleString()}</span>
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;
