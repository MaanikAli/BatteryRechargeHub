
import React from 'react';
import { SyncIcon, WifiOffIcon, CheckCircleIcon } from './Icons';
import { SyncStatus } from '../App';
import { useAuth } from './AuthContext';

interface HeaderProps {
  syncStatus: SyncStatus;
  onAdminProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ syncStatus, onAdminProfile }) => {
  const { logout } = useAuth();
  const getStatusIndicator = () => {
    switch (syncStatus) {
      case 'offline':
        return {
          text: 'Offline',
          icon: <WifiOffIcon />,
          className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        };
      case 'syncing':
        return {
          text: 'Syncing...',
          icon: <SyncIcon className="animate-spin" />,
          className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
        };
      case 'synced':
        return {
          text: 'Synced',
          icon: <CheckCircleIcon />,
          className: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        };
      default:
        return null;
    }
  };

  const status = getStatusIndicator();

  return (
    <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">
            Riaz's ReCharge Hub
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={onAdminProfile}
              className="px-3 py-1.5 text-sm font-semibold bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Admin 
            </button>
            <button
              onClick={logout}
              className="px-3 py-1.5 text-sm font-semibold bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
             {status && (
              <div className={`flex items-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-full ${status.className}`}>
                {status.icon}
                <span>{status.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
