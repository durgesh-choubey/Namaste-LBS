import React from 'react';
import { User, Booking, Notification } from '../App';
import PlusIcon from './icons/PlusIcon';
import BookingCard from './BookingCard';
import NotificationCard from './NotificationCard';

interface MobileHomeScreenProps {
    user: User;
    bookings: Booking[];
    notifications: Notification[];
    onBookNow: () => void;
    onViewAllBookings: () => void;
    onCancelBooking: (bookingId: string) => void;
    onNotificationClick: (notification: Notification) => void;
}

const MobileHomeScreen: React.FC<MobileHomeScreenProps> = ({ user, bookings, notifications, onBookNow, onViewAllBookings, onCancelBooking, onNotificationClick }) => {
    const upcomingBooking = bookings.find(b => b.status === 'upcoming' || b.status === 'active');
    const recentNotifications = notifications.slice(0, 3);

    return (
        <div className="p-4 space-y-6 max-w-screen-md mx-auto">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Hi, {user.name.split(' ')[0]}!</h1>
                <p className="text-slate-500">Ready for a hassle-free laundry day?</p>
            </div>

            <button onClick={onBookNow} className="w-full flex items-center justify-center gap-3 bg-hostel-green-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-hostel-green-700 transition-transform transform hover:scale-105 shadow-lg">
                <PlusIcon className="w-6 h-6" />
                <span>Book a Machine</span>
            </button>
            
            <div>
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold text-slate-700">Your Next Booking</h2>
                    <button onClick={onViewAllBookings} className="text-sm font-medium text-hostel-blue-600 hover:underline">View All</button>
                </div>
                {upcomingBooking ? (
                    <BookingCard booking={upcomingBooking} onCancel={() => onCancelBooking(upcomingBooking.id)} />
                ) : (
                    <div className="text-center bg-white p-6 rounded-xl border border-slate-100 text-slate-500">
                        You have no upcoming bookings.
                    </div>
                )}
            </div>

            <div>
                 <h2 className="text-lg font-bold text-slate-700 mb-3">Announcements</h2>
                 <div className="space-y-3">
                    {recentNotifications.length > 0 ? (
                        recentNotifications.map(notif => (
                            <NotificationCard key={notif.id} notification={notif} onClick={() => onNotificationClick(notif)} />
                        ))
                    ) : (
                        <div className="text-center bg-white p-6 rounded-xl border border-slate-100 text-slate-500">
                            No new announcements.
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default MobileHomeScreen;
