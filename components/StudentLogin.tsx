import React, { useState } from 'react';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import EyeIcon from './icons/EyeIcon';
import EyeSlashIcon from './icons/EyeSlashIcon';

interface StudentLoginProps {
    onLogin: (credentials: { phone: string, password: string }) => Promise<void>;
    onSwitchToSignup: () => void;
    onBack: () => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin, onSwitchToSignup, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Allow only digits
        setPhone(value);
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length !== 10) {
            setError('Phone number must be exactly 10 digits.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await onLogin({ phone, password });
        } catch (error) {
            // Error is handled in App.tsx's toast and will bubble up
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
                        Student Login
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600">
                        Access your laundry dashboard.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4">
                        <div>
                            <input name="phone" type="tel" maxLength={10} required 
                                className={inputStyle} 
                                placeholder="Phone Number (10 digits)" 
                                value={phone}
                                onChange={handlePhoneChange}
                            />
                        </div>
                        <div className="relative">
                            <input name="password" type={showPassword ? 'text' : 'password'} required 
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
                        <button type="submit" disabled={isLoading} className="mt-2 group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-hostel-green-600 hover:bg-hostel-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hostel-green-500 disabled:bg-hostel-green-300 disabled:cursor-not-allowed">
                            {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Sign in'}
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <button onClick={onSwitchToSignup} className="font-medium text-hostel-blue-600 hover:text-hostel-blue-500">
                        Don't have an account? Sign up
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentLogin;