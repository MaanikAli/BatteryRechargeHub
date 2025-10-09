import React, { useState } from 'react';
// FIX: Imported `PlusIcon` which was missing and caused a compilation error.
import { UserPlusIcon, XIcon, CameraIcon, PlusIcon } from './Icons';
import { Client } from '../types';

type AddClientData = Omit<Client, 'id' | 'transactions' | 'createdAt'>;

interface AddClientModalProps {
  onClose: () => void;
  onAddClient: (clientData: AddClientData) => void;
  vehicleTypes: import('../types').VehicleType[];
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onClose, onAddClient, vehicleTypes }) => {
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phone, setPhone] = useState('');
  const [nid, setNid] = useState('');
  const [address, setAddress] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedVehicleTypeId, setSelectedVehicleTypeId] = useState(vehicleTypes.length > 0 ? vehicleTypes[0].id : '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      onAddClient({
        name: name.trim(),
        fatherName: fatherName.trim(),
        phone: phone.trim(),
        nid: nid.trim(),
        address: address.trim(),
        imageUrl: imagePreview || undefined,
        vehicleTypeId: selectedVehicleTypeId,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlusIcon />
                Create New Client
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <XIcon />
            </button>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                  <div className="flex flex-col items-center gap-4 sm:flex-row">
                      <div className="relative">
                          <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                              {imagePreview ? (
                                  <img src={imagePreview} alt="Client" className="h-full w-full object-cover"/>
                              ) : (
                                  <CameraIcon className="h-10 w-10 text-slate-400"/>
                              )}
                          </div>
                          <label htmlFor="clientPicture" className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-700 border-2 border-white dark:border-slate-800">
                            <PlusIcon className="h-4 w-4"/>
                          </label>
                          <input
                              type="file"
                              id="clientPicture"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                          />
                      </div>
                      <div className="w-full space-y-4">
                        <div>
                            <label htmlFor="clientName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Client Name
                            </label>
                            <input type="text" id="clientName" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700" required placeholder="e.g. John Doe"/>
                        </div>
                        <div>
                            <label htmlFor="fatherName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Father's Name
                            </label>
                            <input type="text" id="fatherName" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700" placeholder="e.g. Richard Doe"/>
                        </div>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="clientPhone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Phone Number
                          </label>
                          <input type="tel" id="clientPhone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700" required placeholder="e.g. 01712345678"/>
                      </div>
                      <div>
                          <label htmlFor="clientNid" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              NID No. (Optional)
                          </label>
                          <input type="text" id="clientNid" value={nid} onChange={(e) => setNid(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700" placeholder="e.g. 1990123456789"/>
                      </div>
                  </div>
                  <div>
                      <label htmlFor="clientAddress" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Address (Optional)
                      </label>
                      <textarea id="clientAddress" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700" placeholder="e.g. 123 Main St, Dhaka"></textarea>
                  </div>
                  <div>
                    <label htmlFor="vehicleType" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Vehicle Type
                    </label>
                    <select
                      id="vehicleType"
                      value={selectedVehicleTypeId}
                      onChange={e => setSelectedVehicleTypeId(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700"
                      required
                    >
                      {vehicleTypes.map(vt => (
                        <option key={vt.id} value={vt.id}>{vt.name} (৳{vt.chargingFee})</option>
                      ))}
                    </select>
                  </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">
                    Add Client
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;