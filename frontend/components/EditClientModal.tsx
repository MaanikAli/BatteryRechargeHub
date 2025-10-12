import React, { useState } from 'react';
import { PencilIcon, XIcon, CameraIcon, PlusIcon } from './Icons';
import { Client, VehicleType } from '../types';
import ImageCropModal from './ImageCropModal';

interface EditClientModalProps {
  client: Client;
  onClose: () => void;
  onUpdateClient: (client: Client) => void;
  vehicleTypes: VehicleType[];
}

const EditClientModal: React.FC<EditClientModalProps> = ({ client, onClose, onUpdateClient, vehicleTypes }) => {
  const [name, setName] = useState(client.name);
  const [fatherName, setFatherName] = useState(client.fatherName);
  const [phone, setPhone] = useState(client.phone);
  const [nid, setNid] = useState(client.nid);
  const [address, setAddress] = useState(client.address);
  const [vehicleTypeId, setVehicleTypeId] = useState(client.vehicleTypeId);
  const [imagePreview, setImagePreview] = useState<string | null>(client.imageUrl || null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageSrc = reader.result as string;
        setRawImageSrc(imageSrc);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedImage: string) => {
    setImagePreview(croppedImage);
    setShowCropModal(false);
    setRawImageSrc(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && phone.trim()) {
      const updatedClient: Client = {
        ...client,
        name: name.trim(),
        fatherName: fatherName.trim(),
        phone: phone.trim(),
        nid: nid.trim(),
        address: address.trim(),
        vehicleTypeId: vehicleTypeId,
        imageUrl: imagePreview || undefined,
      };
      onUpdateClient(updatedClient);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PencilIcon />
                Edit Client Information
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
                          <label htmlFor="clientPictureEdit" className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-indigo-700 border-2 border-white dark:border-slate-800">
                            <PlusIcon className="h-4 w-4"/>
                          </label>
                          <input
                              type="file"
                              id="clientPictureEdit"
                              className="hidden"
                              accept="image/*"
                              onChange={handleImageChange}
                          />
                      </div>
                      <div className="w-full space-y-4">
                        <div>
                            <label htmlFor="clientNameEdit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Client Name
                            </label>
                            <input type="text" id="clientNameEdit" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700" required placeholder="e.g. John Doe"/>
                        </div>
                        <div>
                            <label htmlFor="fatherNameEdit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Father's Name
                            </label>
                            <input type="text" id="fatherNameEdit" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700" placeholder="e.g. Richard Doe"/>
                        </div>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label htmlFor="clientPhoneEdit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Phone Number
                          </label>
                          <input type="tel" id="clientPhoneEdit" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700" required placeholder="e.g. 01712345678"/>
                      </div>
                      <div>
                          <label htmlFor="clientNidEdit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              NID No. (Optional)
                          </label>
                          <input type="text" id="clientNidEdit" value={nid} onChange={(e) => setNid(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700" placeholder="e.g. 1990123456789"/>
                      </div>
                  </div>
                  <div>
                      <label htmlFor="clientAddressEdit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                          Address (Optional)
                      </label>
                      <textarea id="clientAddressEdit" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700" placeholder="e.g. 123 Main St, Dhaka"></textarea>
                  </div>
                  <div>
                      <label htmlFor="vehicleTypeEdit" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Primary Vehicle Type</label>
                      <select id="vehicleTypeEdit" value={vehicleTypeId} onChange={e => setVehicleTypeId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-slate-700">
                          {vehicleTypes.length > 0 ? vehicleTypes.map(vt => <option key={vt.id} value={vt.id}>{vt.name}</option>) : <option disabled>No vehicle types available</option>}
                      </select>
                  </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-700 bg-white dark:bg-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm hover:bg-slate-50 dark:hover:bg-slate-600">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700">
                    Save Changes
                </button>
            </div>
        </form>
        {showCropModal && rawImageSrc && (
          <ImageCropModal
            imageSrc={rawImageSrc}
            onCropComplete={handleCropComplete}
            onClose={() => {
              setShowCropModal(false);
              setRawImageSrc(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default EditClientModal;