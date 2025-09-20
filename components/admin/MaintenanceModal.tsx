import React, { useState, useEffect } from 'react';
import XIcon from '../icons/XIcon';

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: {date: string, notes: string}) => void;
  machineId?: string;
}

const MaintenanceModal: React.FC<MaintenanceModalProps> = ({ isOpen, onClose, onSave, machineId }) => {
    const [date, setDate] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (isOpen) {
            setDate(new Date().toISOString().split('T')[0]);
            setNotes('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ date, notes });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Schedule Maintenance</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="machine-id-maintenance" className="block text-sm font-medium text-slate-700">Machine ID</label>
                        <input type="text" id="machine-id-maintenance" value={machineId || ''} readOnly className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm bg-slate-100 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="maintenance-date" className="block text-sm font-medium text-slate-700">Date</label>
                        <input type="date" id="maintenance-date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-slate-700">Notes (Optional)</label>
                        <textarea id="notes" rows={3} placeholder="Describe the issue or maintenance task..." value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                         <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300">
                            Cancel
                        </button>
                        <button type="submit" className="bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600">
                            Set Maintenance
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MaintenanceModal;