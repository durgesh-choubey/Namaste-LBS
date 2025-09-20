
import React, { useState, useEffect, useCallback } from 'react';
import PlusIcon from '../icons/PlusIcon';
import TrashIcon from '../icons/TrashIcon';
import SpinnerIcon from '../icons/SpinnerIcon';
import ConfirmationModal from '../ConfirmationModal';

export interface BlockedDate {
    id: string;
    date: string;
    reason: string;
}

interface BlockedDatesManagementProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

const BlockedDatesManagement: React.FC<BlockedDatesManagementProps> = ({ showToast }) => {
    const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newDate, setNewDate] = useState('');
    const [newReason, setNewReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dateToUnblock, setDateToUnblock] = useState<BlockedDate | null>(null);

    const fetchBlockedDates = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/blocked-dates');
            if (!response.ok) throw new Error('Failed to fetch blocked dates');
            const data = await response.json();
            setBlockedDates(data);
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchBlockedDates();
    }, [fetchBlockedDates]);

    const handleBlockDate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDate || !newReason) {
            showToast('Please select a date and provide a reason.', 'error');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch('http://localhost:3001/api/blocked-dates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: newDate, reason: newReason }),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to block date');

            showToast('Date blocked successfully!', 'success');
            setNewDate('');
            setNewReason('');
            fetchBlockedDates();
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleUnblockDate = async () => {
        if (!dateToUnblock) return;
        try {
            const response = await fetch(`http://localhost:3001/api/blocked-dates/${dateToUnblock.id}`, { method: 'DELETE' });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to unblock date');
            }

            showToast('Date unblocked successfully.', 'success');
            setDateToUnblock(null);
            fetchBlockedDates();
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
             setDateToUnblock(null);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Block Dates</h1>
            
            {/* Add new blocked date form */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mb-8">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Block a New Date</h2>
                <form onSubmit={handleBlockDate} className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="w-full sm:w-auto flex-1">
                        <label htmlFor="block-date" className="block text-sm font-medium text-slate-700">Date</label>
                        <input type="date" id="block-date" value={newDate} onChange={e => setNewDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm"
                        />
                    </div>
                     <div className="w-full sm:w-auto flex-1">
                        <label htmlFor="block-reason" className="block text-sm font-medium text-slate-700">Reason</label>
                        <input type="text" id="block-reason" placeholder="e.g., Public Holiday" value={newReason} onChange={e => setNewReason(e.target.value)}
                            className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm"
                        />
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-hostel-blue-600 text-white font-bold py-2.5 px-4 rounded-lg hover:bg-hostel-blue-700 disabled:bg-hostel-blue-300">
                        {isSubmitting ? <SpinnerIcon className="w-5 h-5"/> : <PlusIcon className="w-5 h-5" />}
                        <span>Block Date</span>
                    </button>
                </form>
            </div>
            
            {/* List of blocked dates */}
            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                 <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                     <tbody className="bg-white divide-y divide-slate-200">
                        {isLoading ? (
                             <tr><td colSpan={3} className="text-center p-8 text-slate-500">Loading...</td></tr>
                        ) : blockedDates.length > 0 ? (
                            blockedDates.map(bd => (
                                <tr key={bd.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{new Date(bd.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{bd.reason}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setDateToUnblock(bd)} className="text-red-600 hover:text-red-900 p-1">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={3} className="text-center p-8 text-slate-500">No dates are currently blocked.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal
                isOpen={!!dateToUnblock}
                onClose={() => setDateToUnblock(null)}
                onConfirm={handleUnblockDate}
                title="Unblock Date?"
                message={`Are you sure you want to allow bookings on ${dateToUnblock ? new Date(dateToUnblock.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', timeZone: 'UTC' }) : ''}?`}
                isLoading={false}
            />
        </div>
    );
};

export default BlockedDatesManagement;
