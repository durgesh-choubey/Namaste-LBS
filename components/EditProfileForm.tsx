import React, { useState } from 'react';
import { User } from '../App';
import SpinnerIcon from './icons/SpinnerIcon';
import EyeIcon from './icons/EyeIcon';
import EyeSlashIcon from './icons/EyeSlashIcon';

interface EditProfileFormProps {
    user: User;
    onSave: (updatedUser: Partial<User>) => Promise<void>;
    onCancel: () => void;
    showToast: (message: string, type: 'success' | 'error') => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ user, onSave, onCancel, showToast }) => {
    const [detailsData, setDetailsData] = useState({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        roomNo: user.roomNo || '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isSavingDetails, setIsSavingDetails] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);


    const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDetailsData({ ...detailsData, [e.target.name]: e.target.value });
    };
    
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleDetailsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingDetails(true);
        try {
            await onSave(detailsData);
            // Toast is handled by parent
        } catch (err) {
            // Error toast is handled by parent
        } finally {
            setIsSavingDetails(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('New passwords do not match.', 'error');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            showToast('New password must be at least 6 characters long.', 'error');
            return;
        }

        setIsSavingPassword(true);
        try {
            const response = await fetch('http://localhost:3001/api/users/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    currentPassword: passwordData.currentPassword,
                    newPassword: passwordData.newPassword,
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Failed to change password.');
            
            showToast('Password changed successfully!', 'success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsSavingPassword(false);
        }
    };
    
    const inputStyle = "mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm";

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 space-y-8">
            {/* Details Form */}
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
                 <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">My Details</h3>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
                    <input type="text" name="name" id="name" value={detailsData.name} onChange={handleDetailsChange} className={inputStyle} required />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                    <input type="email" name="email" id="email" value={detailsData.email} onChange={handleDetailsChange} className={inputStyle} required />
                </div>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone</label>
                    <input type="tel" name="phone" id="phone" value={detailsData.phone} onChange={handleDetailsChange} className={inputStyle} required />
                </div>
                <div>
                    <label htmlFor="roomNo" className="block text-sm font-medium text-slate-700">Room No.</label>
                    <input type="text" name="roomNo" id="roomNo" value={detailsData.roomNo} onChange={handleDetailsChange} className={inputStyle} required />
                </div>
                <div className="pt-2 flex justify-end gap-3">
                    <button type="button" onClick={onCancel} className="bg-slate-200 text-slate-800 font-bold py-2 px-4 rounded-lg hover:bg-slate-300">
                        Back
                    </button>
                    <button type="submit" disabled={isSavingDetails} className="w-36 flex items-center justify-center bg-hostel-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-hostel-blue-700 disabled:bg-hostel-blue-300">
                        {isSavingDetails ? <SpinnerIcon className="w-5 h-5" /> : 'Save Details'}
                    </button>
                </div>
            </form>
            
            {/* Password Form */}
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                 <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Change Password</h3>
                <div className="relative">
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-700">Current Password</label>
                    <input type={showCurrent ? 'text' : 'password'} name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className={inputStyle} required />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-8 text-slate-400">
                       {showCurrent ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                    </button>
                </div>
                <div className="relative">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700">New Password</label>
                    <input type={showNew ? 'text' : 'password'} name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className={inputStyle} required />
                     <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-8 text-slate-400">
                       {showNew ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                    </button>
                </div>
                <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">Confirm New Password</label>
                    <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className={inputStyle} required />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-8 text-slate-400">
                       {showConfirm ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                    </button>
                </div>
                <div className="pt-2 flex justify-end">
                    <button type="submit" disabled={isSavingPassword} className="w-44 flex items-center justify-center bg-hostel-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-hostel-green-700 disabled:bg-hostel-green-300">
                        {isSavingPassword ? <SpinnerIcon className="w-5 h-5" /> : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProfileForm;