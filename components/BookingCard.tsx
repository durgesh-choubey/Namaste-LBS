import React from 'react';
import WashingMachineIcon from './icons/WashingMachineIcon';
import ClockIcon from './icons/ClockIcon';
import { Booking } from '../App';

interface BookingCardProps {
  booking: Booking;
  onCancel: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking, onCancel }) => {
  const { machineId, date, time, status } = booking;
  const statusStyles = {
    upcoming: 'bg-green-100 text-green-800',
    active: 'bg-blue-100 text-blue-800 animate-pulse',
    completed: 'bg-slate-100 text-slate-600',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 transition-shadow hover:shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <div className="bg-hostel-blue-100 p-2 rounded-full">
              <WashingMachineIcon className="w-6 h-6 text-hostel-blue-600" />
            </div>
            <div>
              <p className="font-bold text-lg text-slate-800">{machineId}</p>
              <p className="text-sm text-slate-500">{date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4 text-slate-600">
            <ClockIcon className="w-5 h-5" />
            <span>{time}</span>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col items-end gap-3 self-stretch justify-between">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          {status === 'upcoming' && (
             <button 
              onClick={onCancel}
              className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingCard;