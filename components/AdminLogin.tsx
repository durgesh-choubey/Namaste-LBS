import React, { useState } from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import EyeIcon from './icons/EyeIcon';
import EyeSlashIcon from './icons/EyeSlashIcon';

interface AdminLoginProps {
    onLogin: (credentials: { email: string; password: string }) => Promise<void>;
    onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await onLogin({ email, password });
        } catch (error) {
           // Error is handled in App.tsx's toast
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = "appearance-none relative block w-full px-3 py-3 bg-white border border-slate-300 placeholder-slate-400 text-slate-900 rounded-md focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm";

    return (
        <div className="bg-slate-50 min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
                <div>
                     <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-hostel-blue-600 mb-6">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Home
                    </button>
                    <h2 className="text-center text-3xl font-extrabold text-slate-900">
                        Admin Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        Manage laundry operations.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4">
                        <div>
                            <input name="email" type="email" autoComplete="email" required 
                                className={inputStyle} 
                                placeholder="Email address" 
                                value={email}
                                onChange={handleEmailChange}
                            />
                        </div>
                        <div className="relative">
                            <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required 
                                className={inputStyle} 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5" aria-label={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                    </div>

                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                    
                    <div>
                        <button type="submit" disabled={isLoading} className="mt-2 group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-slate-700 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-400 disabled:cursor-not-allowed">
                           {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;