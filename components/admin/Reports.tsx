import React, { useState, useEffect, useCallback } from 'react';
import SimpleBarChart from './SimpleBarChart';
import DownloadIcon from '../icons/DownloadIcon';
// FIX: Import User and Booking types from App.tsx
import { Booking, User } from '../../App';
import SpinnerIcon from '../icons/SpinnerIcon';

interface EnrichedBooking extends Booking {
    userName?: string;
    userRoom?: string;
    userPhone?: string;
}

const Reports: React.FC = () => {
    const [allBookings, setAllBookings] = useState<EnrichedBooking[]>([]);
    const [weeklyData, setWeeklyData] = useState<{ name: string; value: number }[]>([]);
    const [monthlyData, setMonthlyData] = useState<{ name: string; value: number }[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const processData = useCallback((bookings: EnrichedBooking[]) => {
        // Process Weekly Data
        const today = new Date();
        const weeklyCounts: { [key: string]: number } = {};
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyLabels: string[] = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(today.getDate() - i);
            const dayName = days[d.getDay()];
            weeklyLabels.push(dayName);
            weeklyCounts[d.toISOString().split('T')[0]] = 0;
        }

        bookings.forEach(booking => {
            const bookingDate = new Date(booking.date);
            bookingDate.setUTCHours(0, 0, 0, 0); // Normalize date
            const dateStr = bookingDate.toISOString().split('T')[0];
            if (weeklyCounts[dateStr] !== undefined) {
                weeklyCounts[dateStr]++;
            }
        });
        
        const finalWeeklyData = weeklyLabels.map((label, index) => {
            const d = new Date();
            d.setDate(today.getDate() - (6 - index));
            const dateStr = d.toISOString().split('T')[0];
            return { name: label, value: weeklyCounts[dateStr] || 0 };
        });

        setWeeklyData(finalWeeklyData);

        // Process Monthly Data (last 4 weeks)
        const weeklyLabelsMonthly = ['3 Weeks Ago', '2 Weeks Ago', 'Last Week', 'This Week'];
        const monthlyCounts = [0, 0, 0, 0];
        const now = new Date();
        
        bookings.forEach(booking => {
            const bookingDate = new Date(booking.date);
            const diffDays = Math.floor((now.getTime() - bookingDate.getTime()) / (1000 * 3600 * 24));
            
            if (diffDays < 7) monthlyCounts[3]++; // This Week
            else if (diffDays < 14) monthlyCounts[2]++; // Last Week
            else if (diffDays < 21) monthlyCounts[1]++; // 2 Weeks Ago
            else if (diffDays < 28) monthlyCounts[0]++; // 3 Weeks Ago
        });

        setMonthlyData(weeklyLabelsMonthly.map((label, index) => ({ name: label, value: monthlyCounts[index] })));

    }, []);

    // FIX: Fetch users to enrich booking data for CSV export
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [bookingsRes, usersRes] = await Promise.all([
                fetch('http://localhost:3001/api/bookings'),
                fetch('http://localhost:3001/api/users'),
            ]);
            
            if (!bookingsRes.ok || !usersRes.ok) throw new Error('Failed to fetch report data');
            
            const bookingsData: Booking[] = await bookingsRes.json();
            const usersData: User[] = await usersRes.json();
            const userMap = new Map(usersData.map(user => [user.id, user]));

            const enrichedBookings: EnrichedBooking[] = bookingsData.map(booking => {
                const user = userMap.get(booking.userId);
                return {
                    ...booking,
                    userName: user?.name,
                    userRoom: user?.roomNo,
                    userPhone: user?.phone,
                };
            });

            setAllBookings(enrichedBookings);
            processData(enrichedBookings);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [processData]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDownloadReport = () => {
        if (allBookings.length === 0) {
            alert('No booking data to download.');
            return;
        }

        const headers = ['Booking ID', 'Student Name', 'Room No', 'Phone', 'Machine ID', 'Date', 'Time', 'Status'];
        const csvContent = [
            headers.join(','),
            ...allBookings.map(b => [
                b.id,
                `"${b.userName || 'N/A'}"`,
                b.userRoom || 'N/A',
                b.userPhone || 'N/A',
                b.machineId,
                b.date,
                b.time,
                b.status
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', 'hostelwash_bookings_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Reports & Analytics</h1>
                <button 
                    onClick={handleDownloadReport}
                    disabled={isLoading || allBookings.length === 0}
                    className="flex items-center gap-2 bg-white text-slate-700 font-bold py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed">
                    <DownloadIcon className="w-5 h-5" />
                    <span>Download Report</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Weekly Bookings (Last 7 Days)</h2>
                    <div className="h-80">
                         {isLoading ? <div className="flex h-full items-center justify-center"><SpinnerIcon className="w-8 h-8"/></div> : <SimpleBarChart data={weeklyData} />}
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Monthly Bookings (Last 4 Weeks)</h2>
                     <div className="h-80">
                        {isLoading ? <div className="flex h-full items-center justify-center"><SpinnerIcon className="w-8 h-8"/></div> : <SimpleBarChart data={monthlyData} barColor="#22c55e" />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
