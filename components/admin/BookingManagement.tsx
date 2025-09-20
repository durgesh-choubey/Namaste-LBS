import React, { useState, useEffect, useCallback } from 'react';
import { Booking, User } from '../../App';
import SearchIcon from '../icons/SearchIcon';
import TrashIcon from '../icons/TrashIcon';
import ConfirmationModal from '../ConfirmationModal';

interface BookingManagementProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

type EnrichedBooking = Booking & {
    userName?: string;
    userRoom?: string;
};

const BookingManagement: React.FC<BookingManagementProps> = ({ showToast }) => {
    const [bookings, setBookings] = useState<EnrichedBooking[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<EnrichedBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [bookingToCancel, setBookingToCancel] = useState<EnrichedBooking | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [bookingsRes, usersRes] = await Promise.all([
                fetch('http://localhost:3001/api/bookings'),
                fetch('http://localhost:3001/api/users'),
            ]);

            if (!bookingsRes.ok || !usersRes.ok) {
                throw new Error('Failed to fetch data.');
            }

            const bookingsData: Booking[] = await bookingsRes.json();
            const usersData: User[] = await usersRes.json();
            const userMap = new Map(usersData.map(user => [user.id, user]));

            const enrichedBookings = bookingsData.map(booking => {
                const user = userMap.get(booking.userId);
                return {
                    ...booking,
                    userName: user ? user.name : 'Unknown User',
                    userRoom: user ? user.roomNo : 'N/A',
                };
            }).sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime()); // Sort by most recent

            setBookings(enrichedBookings);
            setFilteredBookings(enrichedBookings);

        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const results = bookings.filter(booking =>
            booking.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.machineId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.userRoom?.includes(searchTerm)
        );
        setFilteredBookings(results);
    }, [searchTerm, bookings]);

    const handleCancelClick = (booking: EnrichedBooking) => {
        setBookingToCancel(booking);
    };

    const handleConfirmCancel = async () => {
        if (!bookingToCancel) return;
        try {
            const response = await fetch(`http://localhost:3001/api/bookings/${bookingToCancel.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to cancel booking.');
            }

            showToast('Booking cancelled successfully.', 'success');
            fetchData();
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setBookingToCancel(null);
        }
    };

    const getStatusChip = (status: Booking['status']) => {
        const styles = {
            upcoming: 'bg-green-100 text-green-800',
            active: 'bg-blue-100 text-blue-800',
            completed: 'bg-slate-100 text-slate-600',
        };
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">Booking Management</h2>
                <div className="relative w-full sm:w-64">
                    <input 
                        type="text" 
                        placeholder="Search by student, machine..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-hostel-blue-500 focus:border-hostel-blue-500" 
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Machine ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date & Time</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center p-8 text-slate-500">Loading bookings...</td></tr>
                        ) : filteredBookings.map((booking) => (
                            <tr key={booking.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="font-medium text-slate-900">{booking.userName}</div>
                                    <div className="text-slate-500">Room: {booking.userRoom}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{booking.machineId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{booking.date}, {booking.time}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(booking.status)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {booking.status !== 'completed' && (
                                        <button onClick={() => handleCancelClick(booking)} className="text-red-600 hover:text-red-900 p-1" title="Cancel Booking">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 { !isLoading && filteredBookings.length === 0 && (
                    <div className="text-center p-8 text-slate-500">
                        {searchTerm ? 'No bookings match your search.' : 'No bookings found.'}
                    </div>
                )}
            </div>
            <ConfirmationModal
                isOpen={!!bookingToCancel}
                onClose={() => setBookingToCancel(null)}
                onConfirm={handleConfirmCancel}
                title="Cancel Booking?"
                message={`Are you sure you want to cancel this booking for ${bookingToCancel?.userName} on ${bookingToCancel?.date}?`}
                isLoading={false}
            />
        </div>
    );
};

export default BookingManagement;
