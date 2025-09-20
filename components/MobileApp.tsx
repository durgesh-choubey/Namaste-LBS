import React, { useState, useMemo } from 'react';
import { User, Booking, Notification } from '../App';
import BottomNavBar from './BottomNavBar';
import MobileHomeScreen from './MobileHomeScreen';
import BookingCard from './BookingCard';
import ProfileCard from './ProfileCard';
import EditProfileForm from './EditProfileForm';
import NotificationDetailModal from './NotificationDetailModal';
import ConfirmationModal from './ConfirmationModal';
import StudentDocuments from './StudentDocuments';

type Tab = 'home' | 'bookings' | 'profile' | 'documents';

interface MobileAppProps {
    user: User;
    bookings: Booking[];
    notifications: Notification[];
    onLogout: () => void;
    onBookNow: () => void;
    onCancelBooking: (bookingId: string) => void;
    onUpdateUser: (user: Partial<User>) => Promise<void>;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const MobileApp: React.FC<MobileAppProps> = ({ user, bookings, notifications, onBookNow, onCancelBooking, onUpdateUser, showToast }) => {
    const [activeTab, setActiveTab] = useState<Tab>('home');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

    const sortedBookings = useMemo(() => {
        return [...bookings].sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());
    }, [bookings]);
    
    const handleCancelClick = (booking: Booking) => {
        setBookingToCancel(booking);
    };
    
    const handleConfirmCancel = () => {
        if (bookingToCancel) {
            onCancelBooking(bookingToCancel.id);
        }
        setBookingToCancel(null);
    };

    const handleUpdateProfile = async (updatedUser: Partial<User>) => {
        await onUpdateUser(updatedUser);
        setIsEditingProfile(false); // Close form on successful save
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'home':
                return <MobileHomeScreen 
                            user={user} 
                            bookings={sortedBookings}
                            notifications={notifications}
                            onBookNow={onBookNow} 
                            onViewAllBookings={() => setActiveTab('bookings')}
                            onCancelBooking={(id) => {
                                const booking = bookings.find(b => b.id === id);
                                if (booking) handleCancelClick(booking);
                            }}
                            onNotificationClick={setSelectedNotification}
                        />;
            case 'bookings':
                return (
                     <div className="p-4 space-y-4 max-w-screen-md mx-auto">
                        <h1 className="text-2xl font-bold text-slate-800">My Bookings</h1>
                        {sortedBookings.length > 0 ? (
                            sortedBookings.map(b => <BookingCard key={b.id} booking={b} onCancel={() => handleCancelClick(b)} />)
                        ) : (
                            <div className="text-center bg-white p-8 rounded-xl border border-slate-100 text-slate-500 mt-4">
                                You haven't made any bookings yet.
                            </div>
                        )}
                     </div>
                );
            case 'profile':
                 return (
                     <div className="p-4 space-y-4 max-w-screen-md mx-auto">
                        <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
                        {isEditingProfile ? (
                            <EditProfileForm user={user} onSave={handleUpdateProfile} onCancel={() => setIsEditingProfile(false)} showToast={showToast} />
                        ) : (
                            <ProfileCard user={user} onEditClick={() => setIsEditingProfile(true)} />
                        )}
                     </div>
                );
            // FIX: Add case for 'documents' to render the StudentDocuments component.
            case 'documents':
                return <StudentDocuments />;
            default:
                return <MobileHomeScreen 
                            user={user} 
                            bookings={bookings} 
                            notifications={notifications}
                            onBookNow={onBookNow} 
                            onViewAllBookings={() => setActiveTab('bookings')}
                            onCancelBooking={(id) => {
                                const booking = bookings.find(b => b.id === id);
                                if (booking) handleCancelClick(booking);
                            }}
                            onNotificationClick={setSelectedNotification}
                        />;
        }
    }

    return (
        <div className="pb-20"> {/* Padding bottom for the nav bar */}
            {renderContent()}
            {/* FIX: Add type guard to onTabChange to ensure only student-valid tabs are set. */}
            <BottomNavBar user={user} activeTab={activeTab} onTabChange={(tab) => {
                if (tab !== 'admin') {
                    setActiveTab(tab);
                }
            }} />
            
            <NotificationDetailModal 
                isOpen={!!selectedNotification}
                onClose={() => setSelectedNotification(null)}
                notification={selectedNotification}
            />

            <ConfirmationModal 
                isOpen={!!bookingToCancel}
                onClose={() => setBookingToCancel(null)}
                onConfirm={handleConfirmCancel}
                title="Cancel Booking?"
                message={`Are you sure you want to cancel your booking for ${bookingToCancel?.machineId} on ${bookingToCancel?.date} at ${bookingToCancel?.time}?`}
                isLoading={false}
            />
        </div>
    );
};

export default MobileApp;