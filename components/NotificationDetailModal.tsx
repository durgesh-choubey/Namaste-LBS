import React from 'react';
import { Notification } from '../App';
import XIcon from './icons/XIcon';

interface NotificationDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    notification: Notification | null;
}

const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({ isOpen, onClose, notification }) => {
    if (!isOpen || !notification) return null;

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-lg relative transform transition-all animate-slide-up max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-800">{notification.subject}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="overflow-y-auto">
                    <p className="text-xs text-slate-400 mb-4">{new Date(notification.timestamp).toLocaleString()}</p>
                    <p className="text-slate-600 whitespace-pre-wrap mb-4">{notification.message}</p>
                    {notification.media && notification.media_type && (
                        <img 
                            src={`data:${notification.media_type};base64,${notification.media}`} 
                            alt="Notification media" 
                            className="mt-3 rounded-lg w-full h-auto object-contain border border-slate-200" 
                        />
                    )}
                </div>
                 <style>{`
                    @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                    }
                    @keyframes slide-up {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                    }
                    .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                    .animate-slide-up { animation: slide-up 0.4s ease-out forwards; }
                `}</style>
            </div>
        </div>
    );
};

export default NotificationDetailModal;
