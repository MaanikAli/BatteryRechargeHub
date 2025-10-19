import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { UserIcon } from './Icons';
import logo from '../src/assets/title.png';

interface HeaderProps {
  onAdminProfile: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAdminProfile }) => {
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-yellow-500/50 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Logo" className="h-16 w-16" />
            <h1 className="text-xl font-bold text-white">
              Riaz's ReCharge Hub
            </h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-white/20 text-white rounded hover:bg-white/30"
            >
              <UserIcon className="h-5 w-5" />
              
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    onAdminProfile();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Admin Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
