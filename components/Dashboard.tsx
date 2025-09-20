import React from 'react';
import { User, Booking, Notification } from '../App';
import MobileApp from './MobileApp';

interface DashboardProps {
    user: User;
    bookings: Booking[];
    notifications: Notification[];
    onLogout: () => void;
    onBookNow: () => void;
    onCancelBooking: (bookingId: string) => void;
    onUpdateUser: (user: Partial<User>) => Promise<void>;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
    // This dashboard component renders the MobileApp view for students.
    // For a more complex application, this component could conditionally render
    // different layouts for desktop vs. mobile.
    return <MobileApp {...props} />;
};

export default Dashboard;
