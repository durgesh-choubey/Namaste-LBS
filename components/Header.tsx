import React from 'react';
import LogoutIcon from './icons/LogoutIcon';

interface HeaderProps {
    user: { name: string; role: 'student' | 'admin' } | null;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="Namaste LBS Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-slate-800">Namaste LBS</h1>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-slate-600 hidden sm:block">
              Hi, <span className="font-medium">{user.name}</span>
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-slate-500 hover:text-hostel-blue-600 transition-colors"
              aria-label="Logout"
            >
              <LogoutIcon className="w-5 h-5" />
              <span className="hidden md:block">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;