import React, { useState } from 'react';
import { User } from '../App';
import Overview from './admin/Overview';
import MachineManagement from './admin/MachineManagement';
import BookingManagement from './admin/BookingManagement';
import UserManagement from './admin/UserManagement';
import Communication from './admin/Communication';
import DocumentManagement from './admin/DocumentManagement';
import Reports from './admin/Reports';
import Settings from './admin/Settings';
import BlockedDatesManagement from './admin/BlockedDatesManagement';

import LayoutDashboardIcon from './icons/LayoutDashboardIcon';
import WashingMachineIcon from './icons/WashingMachineIcon';
import ClipboardListIcon from './icons/ClipboardListIcon';
import UsersIcon from './icons/UsersIcon';
import BellIcon from './icons/BellIcon';
import FileTextIcon from './icons/FileTextIcon';
import SettingsIcon from './icons/SettingsIcon';
import CalendarOffIcon from './icons/CalendarOffIcon';
import MenuIcon from './icons/MenuIcon';
import XIcon from './icons/XIcon';
import DocumentTextIcon from './icons/DocumentTextIcon';

type AdminView = 'overview' | 'machines' | 'bookings' | 'users' | 'communication' | 'documents' | 'reports' | 'settings' | 'blocked-dates';

const AdminDashboard: React.FC<{ user: User | null; onLogout: () => void; showToast: (message: string, type: 'success' | 'error') => void; }> = ({ user, onLogout, showToast }) => {
    const [activeView, setActiveView] = useState<AdminView>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const navItems = [
        { id: 'overview', label: 'Overview', icon: <LayoutDashboardIcon className="w-5 h-5" /> },
        { id: 'machines', label: 'Machines', icon: <WashingMachineIcon className="w-5 h-5" /> },
        { id: 'bookings', label: 'Bookings', icon: <ClipboardListIcon className="w-5 h-5" /> },
        { id: 'users', label: 'Users', icon: <UsersIcon className="w-5 h-5" /> },
        { id: 'blocked-dates', label: 'Block Dates', icon: <CalendarOffIcon className="w-5 h-5" /> },
        { id: 'communication', label: 'Communication', icon: <BellIcon className="w-5 h-5" /> },
        { id: 'documents', label: 'Documents', icon: <DocumentTextIcon className="w-5 h-5" /> },
        { id: 'reports', label: 'Reports', icon: <FileTextIcon className="w-5 h-5" /> },
        { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-5 h-5" /> },
    ];

    const renderView = () => {
        switch (activeView) {
            case 'overview': return <Overview showToast={showToast} />;
            case 'machines': return <MachineManagement showToast={showToast} />;
            case 'bookings': return <BookingManagement showToast={showToast} />;
            case 'users': return <UserManagement showToast={showToast} />;
            case 'communication': return <Communication showToast={showToast} />;
            case 'documents': return <DocumentManagement showToast={showToast} />;
            case 'reports': return <Reports />;
            case 'settings': return <Settings showToast={showToast} user={user} onLogout={onLogout} />;
            case 'blocked-dates': return <BlockedDatesManagement showToast={showToast} />;
            default: return <Overview showToast={showToast} />;
        }
    };
    
    const Sidebar = () => (
         <aside className="w-64 bg-white border-r border-slate-200 flex flex-col h-screen">
            <div className="p-4 border-b border-slate-200">
                <h2 className="font-bold text-lg text-slate-700">Admin Panel</h2>
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => {
                            setActiveView(item.id as AdminView);
                            setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            activeView === item.id 
                            ? 'bg-hostel-blue-100 text-hostel-blue-700'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );

    return (
        <div className="flex h-[calc(100vh-69px)]"> {/* Adjust height to account for header */}
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>
            
            {/* Mobile Sidebar */}
             <div className={`fixed inset-0 z-50 transform lg:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="absolute inset-0 bg-black/40" onClick={() => setIsSidebarOpen(false)}></div>
                <div className="relative">
                    <Sidebar />
                </div>
            </div>

            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-50">
                <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 mb-4 -ml-2 text-slate-600">
                    <MenuIcon className="w-6 h-6" />
                </button>
                {renderView()}
            </main>
        </div>
    );
};

export default AdminDashboard;