import React, { useState, useEffect, useCallback } from 'react';
import PlusIcon from '../icons/PlusIcon';
import EditIcon from '../icons/EditIcon';
import TrashIcon from '../icons/TrashIcon';
import WrenchIcon from '../icons/WrenchIcon';
import ConfirmationModal from '../ConfirmationModal';
import MachineModal from './MachineModal';
import MaintenanceModal from './MaintenanceModal';

export interface Machine {
    id: string;
    model: string;
    status: 'available' | 'in-use' | 'maintenance';
    lastMaintenance: string;
}

interface MachineManagementProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

const MachineManagement: React.FC<MachineManagementProps> = ({ showToast }) => {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);
    const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

    const fetchMachines = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/machines');
            if (!response.ok) throw new Error('Failed to fetch machines');
            const data = await response.json();
            setMachines(data);
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchMachines();
    }, [fetchMachines]);

    const handleAddClick = () => {
        setSelectedMachine(null);
        setIsMachineModalOpen(true);
    };

    const handleEditClick = (machine: Machine) => {
        setSelectedMachine(machine);
        setIsMachineModalOpen(true);
    };

    const handleDeleteClick = (machine: Machine) => {
        setSelectedMachine(machine);
        setIsDeleteModalOpen(true);
    };

    const handleMaintenanceClick = (machine: Machine) => {
        setSelectedMachine(machine);
        setIsMaintenanceModalOpen(true);
    };
    
    const handleSaveMachine = async (machineData: Omit<Machine, 'id'> & { id?: string }) => {
        const isNew = !selectedMachine;
        const url = isNew ? 'http://localhost:3001/api/machines' : `http://localhost:3001/api/machines/${machineData.id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(machineData),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || `Failed to ${isNew ? 'add' : 'update'} machine`);
            
            showToast(`Machine ${isNew ? 'added' : 'updated'} successfully!`, 'success');
            setIsMachineModalOpen(false);
            fetchMachines();
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };
    
    const handleDeleteMachine = async () => {
        if (!selectedMachine) return;
        try {
            const response = await fetch(`http://localhost:3001/api/machines/${selectedMachine.id}`, { method: 'DELETE' });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete machine');
            }
            showToast('Machine deleted successfully.', 'success');
            setIsDeleteModalOpen(false);
            fetchMachines();
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    const handleSetMaintenance = async (details: {date: string, notes: string}) => {
        if (!selectedMachine) return;
        
        const updatedMachine = { ...selectedMachine, status: 'maintenance' as const, lastMaintenance: details.date };
        
        try {
            const response = await fetch(`http://localhost:3001/api/machines/${selectedMachine.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedMachine),
            });
            if (!response.ok) throw new Error('Failed to set maintenance status.');

            showToast(`Machine ${selectedMachine.id} set to maintenance.`, 'success');
            setIsMaintenanceModalOpen(false);
            fetchMachines();
        } catch(error: any) {
            showToast(error.message, 'error');
        }
    };

    const getStatusChip = (status: Machine['status']) => {
        const styles = {
            available: 'bg-green-100 text-green-800',
            'in-use': 'bg-blue-100 text-blue-800',
            maintenance: 'bg-amber-100 text-amber-800',
        };
        return <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>{status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>;
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Machine Management</h2>
                <button onClick={handleAddClick} className="flex items-center gap-2 bg-hostel-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-hostel-blue-700">
                    <PlusIcon className="w-5 h-5"/>
                    <span>Add Machine</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Model</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Last Maintenance</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center p-8 text-slate-500">Loading machines...</td></tr>
                        ) : machines.map((machine) => (
                            <tr key={machine.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{machine.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{machine.model}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusChip(machine.status)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(machine.lastMaintenance).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button onClick={() => handleMaintenanceClick(machine)} className="text-amber-600 hover:text-amber-900 p-1" title="Set Maintenance"><WrenchIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleEditClick(machine)} className="text-hostel-blue-600 hover:text-hostel-blue-900 p-1" title="Edit"><EditIcon className="w-5 h-5"/></button>
                                    <button onClick={() => handleDeleteClick(machine)} className="text-red-600 hover:text-red-900 p-1" title="Delete"><TrashIcon className="w-5 h-5"/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <MachineModal isOpen={isMachineModalOpen} onClose={() => setIsMachineModalOpen(false)} onSave={handleSaveMachine} machine={selectedMachine} showToast={showToast} />
            <MaintenanceModal isOpen={isMaintenanceModalOpen} onClose={() => setIsMaintenanceModalOpen(false)} onSave={handleSetMaintenance} machineId={selectedMachine?.id} />
            <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleDeleteMachine} title="Delete Machine?" message={`Are you sure you want to delete machine ${selectedMachine?.id}? This action cannot be undone.`} isLoading={false} />
        </div>
    );
};

export default MachineManagement;
