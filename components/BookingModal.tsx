import React, { useState, useEffect, useCallback } from 'react';
import XIcon from './icons/XIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import { Booking } from '../App';

interface Machine {
    id: string;
    model: string;
    status: string;
    lastMaintenance: string;
}

interface TimeSlot {
    time: string;
    available: boolean;
}

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBook: (newBooking: Omit<Booking, 'id' | 'status' | 'userId'>) => void;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onBook, showToast }) => {
    const [machines, setMachines] = useState<Machine[]>([]);
    const [selectedMachine, setSelectedMachine] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
    const [selectedTime, setSelectedTime] = useState<string>('');
    const [blockedDates, setBlockedDates] = useState<string[]>([]);
    const [isLoadingMachines, setIsLoadingMachines] = useState(false);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);
    const [isBooking, setIsBooking] = useState(false);

    const resetState = useCallback(() => {
        setSelectedMachine('');
        setSelectedDate('');
        setTimeSlots([]);
        setSelectedTime('');
    }, []);

    useEffect(() => {
        if (isOpen) {
            resetState();
            const today = new Date();
            const offset = today.getTimezoneOffset();
            const localDate = new Date(today.getTime() - (offset*60*1000));
            setSelectedDate(localDate.toISOString().split('T')[0]);

            const fetchInitialData = async () => {
                setIsLoadingMachines(true);
                try {
                    const [machinesRes, blockedDatesRes] = await Promise.all([
                        fetch('http://localhost:3001/api/machines?status=available'),
                        fetch('http://localhost:3001/api/blocked-dates')
                    ]);
                    if (!machinesRes.ok) throw new Error('Failed to load machines.');
                    if (!blockedDatesRes.ok) throw new Error('Failed to load blocked dates.');
                    
                    const machinesData: Machine[] = await machinesRes.json();
                    setMachines(machinesData);
                    if (machinesData.length > 0) {
                        setSelectedMachine(machinesData[0].id);
                    }
                    
                    const blockedDatesData = await blockedDatesRes.json();
                    setBlockedDates(blockedDatesData.map((d: any) => d.date));

                } catch (error: any) {
                    showToast(error.message, 'error');
                    onClose();
                } finally {
                    setIsLoadingMachines(false);
                }
            };
            fetchInitialData();
        }
    }, [isOpen, showToast, onClose, resetState]);
    
    useEffect(() => {
        if (selectedMachine && selectedDate) {
            const fetchSlots = async () => {
                setIsLoadingSlots(true);
                setSelectedTime('');
                try {
                    const response = await fetch(`http://localhost:3001/api/slots?machineId=${selectedMachine}&date=${selectedDate}`);
                    if (!response.ok) throw new Error('Failed to load time slots.');
                    const data = await response.json();
                    setTimeSlots(data);
                } catch (error: any) {
                    showToast(error.message, 'error');
                } finally {
                    setIsLoadingSlots(false);
                }
            };
            fetchSlots();
        }
    }, [selectedMachine, selectedDate, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedMachine || !selectedDate || !selectedTime) {
            showToast('Please select a machine, date, and time.', 'error');
            return;
        }
        setIsBooking(true);
        try {
            await onBook({ machineId: selectedMachine, date: selectedDate, time: selectedTime });
        } catch (error) {
            // Error is handled by parent
        } finally {
            setIsBooking(false);
        }
    };

    const getTomorrowDate = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    }
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative transform transition-all animate-slide-up">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Book a Washing Machine</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                {isLoadingMachines ? (
                    <div className="flex justify-center items-center h-48"><SpinnerIcon className="w-8 h-8"/></div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="machine" className="block text-sm font-medium text-slate-700">Machine</label>
                            <select id="machine" value={selectedMachine} onChange={e => setSelectedMachine(e.target.value)} className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm">
                                {machines.map(m => <option key={m.id} value={m.id}>{m.id} - {m.model}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-slate-700">Date</label>
                            <input type="date" id="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} 
                                min={new Date().toISOString().split('T')[0]}
                                max={getTomorrowDate()}
                                className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Time Slot</label>
                            {isLoadingSlots ? <div className="flex justify-center p-4"><SpinnerIcon className="w-6 h-6" /></div> 
                            : blockedDates.includes(selectedDate) ? <div className="text-center p-4 bg-yellow-50 text-yellow-700 rounded-md">Bookings are blocked for this date.</div>
                            : (
                                <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {timeSlots.map(slot => (
                                        <button type="button" key={slot.time}
                                            onClick={() => setSelectedTime(slot.time)}
                                            disabled={!slot.available}
                                            className={`py-2 px-1 text-sm rounded-md transition-colors ${selectedTime === slot.time ? 'bg-hostel-blue-600 text-white' : 'bg-slate-100'} ${slot.available ? 'hover:bg-hostel-blue-200' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                                        >
                                            {slot.time}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="pt-4 flex justify-end gap-3">
                            <button type="button" onClick={onClose} disabled={isBooking} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300">
                                Cancel
                            </button>
                             <button type="submit" disabled={isBooking || !selectedTime} className="w-32 flex justify-center bg-hostel-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-hostel-green-700 disabled:bg-hostel-green-300">
                                {isBooking ? <SpinnerIcon className="w-5 h-5"/> : 'Book Now'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default BookingModal;