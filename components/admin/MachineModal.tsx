import React, { useState, useEffect } from 'react';
import { Machine } from './MachineManagement';
import XIcon from '../icons/XIcon';
import SpinnerIcon from '../icons/SpinnerIcon';

interface MachineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (machine: Omit<Machine, 'id'> & { id?: string }) => void;
    machine: Machine | null;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const MachineModal: React.FC<MachineModalProps> = ({ isOpen, onClose, onSave, machine, showToast }) => {
    const [formData, setFormData] = useState({
        id: '',
        model: '',
        status: 'available' as Machine['status'],
        lastMaintenance: new Date().toISOString().split('T')[0],
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (machine) {
            setFormData({
                id: machine.id,
                model: machine.model,
                status: machine.status,
                lastMaintenance: new Date(machine.lastMaintenance).toISOString().split('T')[0], // Format for date input
            });
        } else {
             setFormData({
                id: '',
                model: '',
                status: 'available',
                lastMaintenance: new Date().toISOString().split('T')[0],
            });
        }
    }, [machine, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            await onSave(formData);
        } catch (error) {
            // Parent handles toast
        } finally {
            setIsSaving(false);
        }
    };
    
    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">{machine ? 'Edit Machine' : 'Add New Machine'}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><XIcon className="h-6 w-6" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="id" className="block text-sm font-medium text-slate-700">Machine ID</label>
                        <input type="text" name="id" id="id" value={formData.id} onChange={handleChange} disabled={!!machine} placeholder="e.g., WM-03" required className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm disabled:bg-slate-100" />
                    </div>
                     <div>
                        <label htmlFor="model" className="block text-sm font-medium text-slate-700">Model</label>
                        <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} placeholder="e.g., Whirlpool Front-Load" required className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="status" className="block text-sm font-medium text-slate-700">Status</label>
                        <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm">
                            <option value="available">Available</option>
                            <option value="in-use">In Use</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="lastMaintenance" className="block text-sm font-medium text-slate-700">Last Maintenance Date</label>
                        <input type="date" name="lastMaintenance" id="lastMaintenance" value={formData.lastMaintenance} onChange={handleChange} required className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm" />
                    </div>
                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSaving} className="w-28 flex justify-center bg-hostel-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-hostel-blue-700 disabled:bg-hostel-blue-300">
                           {isSaving ? <SpinnerIcon className="w-5 h-5"/> : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MachineModal;
