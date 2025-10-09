import React from 'react';
import { SyncIcon, WifiOffIcon, CheckCircleIcon } from './Icons';
import { SyncStatus } from '../App';
import { useAuth } from './AuthContext';
import { useTheme } from './ThemeContext';

interface HeaderProps {
  syncStatus: SyncStatus;
  onAdminProfile: () => void;
}

const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
  </svg>
);

const MoonIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" {...props}>
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const Header: React.FC<HeaderProps> = ({ syncStatus, onAdminProfile }) => {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

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
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-slate-800 dark:to-slate-900 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-white">
            Riaz's ReCharge Hub
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={onAdminProfile}
              className="px-3 py-1.5 text-sm font-semibold bg-white/20 text-white rounded hover:bg-white/30"
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
