import React from 'react';
import { useAuth } from './AuthContext';

interface HeaderProps {
  onAdminProfile: () => void;
}



const Header: React.FC<HeaderProps> = ({ onAdminProfile }) => {
  const { logout } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <h1 className="text-xl font-bold text-white">
            Riaz's ReCharge Hub
          </h1>
          <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
