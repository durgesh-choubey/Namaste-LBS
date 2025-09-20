import React, { useState, useEffect, useCallback } from 'react';
import AnalyticsCard from '../AnalyticsCard';
import { Booking, User } from '../../App';
import { Machine } from './MachineManagement';
import ChartBarIcon from '../icons/ChartBarIcon';
import ClipboardListIcon from '../icons/ClipboardListIcon';
import UsersIcon from '../icons/UsersIcon';
import WrenchIcon from '../icons/WrenchIcon';

interface OverviewProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

type EnrichedBooking = Booking & {
    userName?: string;
    userRoom?: string;
};

const Overview: React.FC<OverviewProps> = ({ showToast }) => {
    const [stats, setStats] = useState({ totalBookings: 0, activeMachines: 0, totalUsers: 0, maintenanceMachines: 0 });
    const [recentBookings, setRecentBookings] = useState<EnrichedBooking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOverviewData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [bookingsRes, machinesRes, usersRes] = await Promise.all([
                fetch('http://localhost:3001/api/bookings'),
                fetch('http://localhost:3001/api/machines'),
                fetch('http://localhost:3001/api/users'),
            ]);

            if (!bookingsRes.ok || !machinesRes.ok || !usersRes.ok) {
                throw new Error('Failed to fetch overview data.');
            }

            const bookings: Booking[] = await bookingsRes.json();
            const machines: Machine[] = await machinesRes.json();
            const users: User[] = await usersRes.json();

            setStats({
                totalBookings: bookings.length,
                activeMachines: machines.filter(m => m.status === 'in-use').length,
                totalUsers: users.length,
                maintenanceMachines: machines.filter(m => m.status === 'maintenance').length,
            });
            
            const userMap = new Map(users.map(user => [user.id, user]));

            const enrichedBookings = bookings
                .filter(b => b.status === 'upcoming')
                .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
                .map(booking => {
                    const user = userMap.get(booking.userId);
                    return {
                        ...booking,
                        userName: user ? user.name : 'Unknown User',
                        userRoom: user ? user.roomNo : 'N/A',
                    };
                })
                .slice(0, 5);
            setRecentBookings(enrichedBookings);

        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchOverviewData();
    }, [fetchOverviewData]);
    
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
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard Overview</h1>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AnalyticsCard icon={<ClipboardListIcon className="w-6 h-6 text-hostel-blue-600" />} title="Total Bookings" value={stats.totalBookings} />
                <AnalyticsCard icon={<ChartBarIcon className="w-6 h-6 text-hostel-blue-600" />} title="Machines In Use" value={stats.activeMachines} />
                <AnalyticsCard icon={<UsersIcon className="w-6 h-6 text-hostel-blue-600" />} title="Total Users" value={stats.totalUsers} />
                <AnalyticsCard icon={<WrenchIcon className="w-6 h-6 text-hostel-blue-600" />} title="Maintenance" value={stats.maintenanceMachines} />
            </div>

            {/* Recent Bookings */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Upcoming Bookings</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Room No.</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Machine ID</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date & Time</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-slate-200">
                            {isLoading ? (
                                <tr><td colSpan={5} className="text-center p-8 text-slate-500">Loading...</td></tr>
                            ) : recentBookings.length > 0 ? (
                                recentBookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{booking.userName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{booking.userRoom}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{booking.machineId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{booking.date}, {booking.time}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(booking.status)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="text-center p-8 text-slate-500">No upcoming bookings.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Overview;