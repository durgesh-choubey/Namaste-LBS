import React from 'react';
import { Notification } from '../App';
import BellIcon from './icons/BellIcon';

interface NotificationCardProps {
    notification: Notification;
    onClick: () => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onClick }) => {
    const truncateMessage = (msg: string, length = 100) => {
        return msg.length > length ? msg.substring(0, length) + '...' : msg;
    };

    return (
        <button onClick={onClick} className="w-full text-left bg-white p-4 rounded-xl shadow-md border border-slate-100 transition-shadow hover:shadow-lg flex items-start gap-4">
            <div className="flex-shrink-0 bg-hostel-blue-100 p-2.5 rounded-full mt-1">
                <BellIcon className="w-5 h-5 text-hostel-blue-600" />
            </div>
            <div className="flex-1">
                <p className="font-bold text-slate-800">{notification.subject}</p>
                <p className="text-sm text-slate-500 mt-1">{truncateMessage(notification.message)}</p>
                <p className="text-xs text-slate-400 mt-2">{new Date(notification.timestamp).toLocaleDateString()}</p>
            </div>
        </button>
    );
};

export default NotificationCard;
