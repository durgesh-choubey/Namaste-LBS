import React from 'react';
import HomeIcon from './icons/HomeIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import UserIcon from './icons/UserIcon';
import { User } from '../App';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';

// FIX: Add 'documents' to the Tab type to match the definition in MobileApp.tsx.
type Tab = 'home' | 'bookings' | 'profile' | 'admin' | 'documents';

interface BottomNavBarProps {
    user: User;
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
            isActive ? 'text-hostel-blue-600' : 'text-slate-500 hover:text-hostel-blue-500'
        }`}
        aria-label={`Go to ${label}`}
        aria-current={isActive ? 'page' : undefined}
    >
        {icon}
        <span className="text-xs font-medium mt-1">{label}</span>
    </button>
);

const BottomNavBar: React.FC<BottomNavBarProps> = ({ user, activeTab, onTabChange }) => {
    let navItems;

    if (user.role === 'admin') {
        navItems = [
            { id: 'admin', label: 'Admin', icon: <ShieldCheckIcon className="w-6 h-6" /> }
        ];
    } else {
        navItems = [
            { id: 'home', label: 'Home', icon: <HomeIcon className="w-6 h-6" /> },
            { id: 'bookings', label: 'Bookings', icon: <ClipboardListIcon className="w-6 h-6" /> },
            // FIX: Add 'documents' tab for students.
            { id: 'documents', label: 'Documents', icon: <DocumentTextIcon className="w-6 h-6" /> },
            { id: 'profile', label: 'Profile', icon: <UserIcon className="w-6 h-6" /> },
        ];
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-upper z-40">
            <div className="flex justify-around max-w-screen-sm mx-auto">
                {navItems.map(item => (
                    <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={activeTab === item.id}
                        onClick={() => onTabChange(item.id as Tab)}
                    />
                ))}
            </div>
             <style>{`
                .shadow-upper {
                    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
                }
            `}</style>
        </nav>
    );
};

export default BottomNavBar;