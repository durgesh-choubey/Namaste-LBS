import React, { useState } from 'react';
import { User } from '../../App';
import LogoutIcon from '../icons/LogoutIcon';
import SpinnerIcon from '../icons/SpinnerIcon';
import EyeIcon from '../icons/EyeIcon';
import EyeSlashIcon from '../icons/EyeSlashIcon';

interface SettingsProps {
    showToast: (message: string, type: 'success' | 'error') => void;
    user: User | null;
    onLogout: () => void;
}

const Settings: React.FC<SettingsProps> = ({ showToast, user, onLogout }) => {
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showToast('New passwords do not match.', 'error');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            showToast('New password must be at least 6 characters.', 'error');
            return;
        }
        if (!user) {
            showToast('Cannot change password. User not found.', 'error');
            return;
        }

        setIsSaving(true);
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
            
            showToast('Password updated successfully!', 'success');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    const inputStyle = "mt-1 block w-full py-2 px-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm";
    const labelStyle = "block text-sm font-medium text-slate-700";

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Settings</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1 */}
                <div className="space-y-8">
                    {/* My Profile */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">My Profile</h2>
                        <div className="space-y-3">
                             <div>
                                <label className="text-sm font-medium text-slate-500">Name</label>
                                <p className="text-slate-800 font-semibold">{user?.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-500">Email</label>
                                <p className="text-slate-800 font-semibold">{user?.email}</p>
                            </div>
                             <div>
                                <label className="text-sm font-medium text-slate-500">Role</label>
                                <p className="text-slate-800 font-semibold capitalize">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                    {/* Account Actions */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Account Actions</h2>
                        <button onClick={onLogout} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600">
                            <LogoutIcon className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-8">
                    {/* Change Password */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Change Password</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="currentPassword" className={labelStyle}>Current Password</label>
                                <div className="relative">
                                    <input type={showCurrentPassword ? 'text' : 'password'} name="currentPassword" id="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className={inputStyle} required />
                                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        {showCurrentPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="newPassword" className={labelStyle}>New Password</label>
                                 <div className="relative">
                                    <input type={showNewPassword ? 'text' : 'password'} name="newPassword" id="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className={inputStyle} required />
                                     <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        {showNewPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className={labelStyle}>Confirm New Password</label>
                                <div className="relative">
                                    <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" id="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className={inputStyle} required />
                                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                        {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                    </button>
                                </div>
                            </div>
                            <div className="pt-2 flex justify-end">
                                <button type="submit" disabled={isSaving} className="w-40 flex items-center justify-center bg-hostel-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-hostel-blue-700 disabled:bg-hostel-blue-300">
                                    {isSaving ? <SpinnerIcon className="w-5 h-5" /> : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;