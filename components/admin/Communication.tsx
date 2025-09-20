import React, { useState, useEffect, useCallback } from 'react';
import { Notification } from '../../App';
import SpinnerIcon from '../icons/SpinnerIcon';
import PaperclipIcon from '../icons/PaperclipIcon';
import TrashIcon from '../icons/TrashIcon';
import XIcon from '../icons/XIcon';
import ConfirmationModal from '../ConfirmationModal';

interface CommunicationProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

const Communication: React.FC<CommunicationProps> = ({ showToast }) => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [media, setMedia] = useState<{ base64: string; name: string; type: string } | null>(null);
    const [isSending, setIsSending] = useState(false);
    
    const [history, setHistory] = useState<Notification[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);

    const fetchHistory = useCallback(async () => {
        setIsLoadingHistory(true);
        try {
            const response = await fetch('http://localhost:3001/api/notifications');
            if (!response.ok) throw new Error('Failed to fetch notification history.');
            const data = await response.json();
            setHistory(data);
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoadingHistory(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showToast('File size should not exceed 5MB.', 'error');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setMedia({
                    base64: reader.result as string,
                    name: file.name,
                    type: file.type
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removeMedia = () => {
        setMedia(null);
        const fileInput = document.getElementById('media-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) {
            showToast('Subject and message are required.', 'error');
            return;
        }
        setIsSending(true);
        try {
            const payload = {
                subject,
                message,
                media: media?.base64.split(',')[1],
                media_type: media?.type,
            };
            const response = await fetch('http://localhost:3001/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send notification.');
            }
            showToast('Notification sent successfully!', 'success');
            setSubject('');
            setMessage('');
            removeMedia();
            fetchHistory(); // Refresh history after sending
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsSending(false);
        }
    };

    const handleDelete = async () => {
        if (!notificationToDelete) return;
        try {
            const response = await fetch(`http://localhost:3001/api/notifications/${notificationToDelete.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete notification.');
            showToast('Notification deleted.', 'success');
            setNotificationToDelete(null);
            fetchHistory(); // Refresh history
        } catch (error: any) {
            showToast(error.message, 'error');
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-800">Communication Center</h1>
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Send New Announcement</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Form fields ... */}
                     <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700">Subject</label>
                        <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required
                            className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700">Message</label>
                        <textarea id="message" rows={6} value={message} onChange={e => setMessage(e.target.value)} required
                            className="mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Attach Media (Optional)</label>
                        {media ? (
                            <div className="mt-2 p-2 border border-slate-200 rounded-lg flex items-center gap-3 bg-slate-50">
                                <PaperclipIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
                                <p className="text-sm font-medium text-slate-700 break-all flex-1">{media.name}</p>
                                <button type="button" onClick={removeMedia} className="p-1 text-slate-400 hover:text-red-500"><XIcon className="w-4 h-4" /></button>
                            </div>
                        ) : (
                             <label htmlFor="media-upload" className="mt-1 relative flex items-center justify-center w-full h-12 border-2 border-slate-300 border-dashed rounded-md cursor-pointer hover:bg-slate-50">
                                <div className="text-sm text-slate-600">
                                    <span className="font-medium text-hostel-blue-600">Click to attach a file</span> (Image or PDF, max 5MB)
                                </div>
                                <input id="media-upload" name="media-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/png, image/jpeg, application/pdf" />
                            </label>
                        )}
                    </div>
                    <div className="pt-2 flex justify-end">
                        <button type="submit" disabled={isSending}
                            className="w-40 flex justify-center bg-hostel-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-hostel-green-700 disabled:bg-hostel-green-300">
                            {isSending ? <SpinnerIcon className="w-5 h-5" /> : 'Send'}
                        </button>
                    </div>
                </form>
            </div>
            
             {/* Notification History */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Notification History</h2>
                <div className="space-y-4">
                    {isLoadingHistory ? (
                        <div className="text-center text-slate-500 p-8">Loading history...</div>
                    ) : history.length > 0 ? (
                        history.map(notif => (
                            <div key={notif.id} className="p-4 border border-slate-200 rounded-lg flex justify-between items-start">
                                <div>
                                    <p className="font-semibold text-slate-800">{notif.subject}</p>
                                    <p className="text-sm text-slate-500 mt-1">{notif.message.substring(0, 100)}...</p>
                                    <p className="text-xs text-slate-400 mt-2">{new Date(notif.timestamp).toLocaleString()}</p>
                                </div>
                                <button onClick={() => setNotificationToDelete(notif)} className="p-2 text-red-500 hover:bg-red-50 rounded-full">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center text-slate-500 p-8">No notifications have been sent yet.</div>
                    )}
                </div>
            </div>

            <ConfirmationModal 
                isOpen={!!notificationToDelete}
                onClose={() => setNotificationToDelete(null)}
                onConfirm={handleDelete}
                title="Delete Notification?"
                message="Are you sure you want to permanently delete this notification?"
                isLoading={false}
            />
        </div>
    );
};

export default Communication;