import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../api';

const AdminProfile: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const { logout } = useAuth();

  const handleBack = () => {
    window.location.reload(); // Simple way to go back to main app
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateCredentials(currentPassword, newUsername, newPassword);
      setMessage('Credentials updated successfully');
      setTimeout(() => logout(), 2000); // Logout after 2 seconds to show message
    } catch (error: any) {
      setMessage(error.message || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
      <div className="max-w-md mx-auto bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <button onClick={handleBack} className="mb-4 text-blue-500 hover:underline">Back</button>
        <h2 className="text-2xl font-bold mb-6">Admin Profile</h2>
        <form onSubmit={handleUpdate}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">New Username</label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4">
            Update Credentials
          </button>
        </form>
        {message && <p className="text-center mb-4">{message}</p>}
        <button onClick={logout} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
