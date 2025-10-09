
import React, { useState } from 'react';
import { PlusIcon, XIcon } from './Icons';

interface AddVehicleTypeModalProps {
  onClose: () => void;
  onAddVehicleType: (name: string, chargingFee: number) => void;
}

const AddVehicleTypeModal: React.FC<AddVehicleTypeModalProps> = ({ onClose, onAddVehicleType }) => {
  const [name, setName] = useState('');
  const [fee, setFee] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chargingFee = parseFloat(fee);
    if (name.trim() && !isNaN(chargingFee) && chargingFee >= 0) {
      onAddVehicleType(name.trim(), chargingFee);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PlusIcon />
                Add Vehicle Type
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <XIcon />
            </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div>
                    <label htmlFor="vehicleName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Vehicle Type Name
                    </label>
                    <input
                        type="text"
                        id="vehicleName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700"
                        required
                        placeholder="e.g. Electric Scooter"
                    />
                </div>
                <div>
                    <label htmlFor="chargingFee" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                       Charging Fee (tk)
                    </label>
                    <input
                        type="number"
                        id="chargingFee"
                        value={fee}
                        onChange={(e) => setFee(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 bg-white dark:bg-slate-700"
                        required
                        placeholder="e.g. 100"
                        min="0"
                    />
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
                    className="px-4 py-2 text-sm font-medium text-white bg-sky-600 border border-transparent rounded-md shadow-sm hover:bg-sky-700"
                >
                    Add Vehicle Type
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleTypeModal;
