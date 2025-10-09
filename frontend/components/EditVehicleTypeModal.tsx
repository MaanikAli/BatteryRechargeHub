import React, { useState } from 'react';
import { VehicleType } from '../types';

interface EditVehicleTypeModalProps {
  vehicleType: VehicleType;
  onClose: () => void;
  onUpdateVehicleType: (updatedVehicleType: VehicleType) => void;
}

const EditVehicleTypeModal: React.FC<EditVehicleTypeModalProps> = ({ vehicleType, onClose, onUpdateVehicleType }) => {
  const [name, setName] = useState(vehicleType.name);
  const [chargingFee, setChargingFee] = useState(vehicleType.chargingFee);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateVehicleType({ ...vehicleType, name, chargingFee });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Vehicle Type</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="vehicleName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vehicle Name</label>
            <input
              type="text"
              id="vehicleName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700"
              required
            />
          </div>
          <div>
            <label htmlFor="chargingFee" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Charging Fee</label>
            <input
              type="number"
              id="chargingFee"
              value={chargingFee}
              onChange={(e) => setChargingFee(Number(e.target.value))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700"
              required
            />
          </div>
          <div className="flex justify-end gap-3">
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

export default EditVehicleTypeModal;