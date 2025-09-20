import React, { useState } from 'react';
import { User } from '../App';
import ArrowLeftIcon from './icons/ArrowLeftIcon';
import SpinnerIcon from './icons/SpinnerIcon';
import EyeIcon from './icons/EyeIcon';
import EyeSlashIcon from './icons/EyeSlashIcon';

interface StudentSignupProps {
    onSignup: (details: Omit<User, 'id' | 'role'> & { password?: string }) => Promise<void>;
    onSwitchToLogin: () => void;
    onBack: () => void;
}

const courses = ["Computer Science", "Mechanical Engineering", "Business Administration", "Fine Arts", "Electrical Engineering"];
const departments = ["School of Engineering", "School of Business", "School of Arts & Sciences"];

const StudentSignup: React.FC<StudentSignupProps> = ({ onSignup, onSwitchToLogin, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        roomNo: '',
        courseName: '',
        departmentName: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        phone: '',
        email: '',
        roomNo: '',
        password: '',
        general: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let processedValue = value;

        if (name === 'phone' || name === 'roomNo') {
            processedValue = value.replace(/\D/g, ''); // Allow only digits
        }

        setFormData({ ...formData, [name]: processedValue });
        if (errors[name as keyof typeof errors]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = (): boolean => {
        const newErrors = { name: '', phone: '', email: '', roomNo: '', password: '', general: '' };
        let isValid = true;

        Object.entries(formData).forEach(([key, value]) => {
            if (!value) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            newErrors.general = 'All fields are required.';
        }

        if (formData.phone.length !== 10) {
            newErrors.phone = 'Phone number must be exactly 10 digits.';
            isValid = false;
        }
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
            isValid = false;
        }
        if (formData.roomNo.length !== 3) {
            newErrors.roomNo = 'Room number must be exactly 3 digits.';
            isValid = false;
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.password = 'Passwords do not match.';
            isValid = false;
        }
        
        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            const { confirmPassword, ...signupData } = formData;
            await onSignup(signupData);
        } catch (error) {
            console.error("Signup failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = "appearance-none relative block w-full px-3 py-3 bg-white border border-slate-300 placeholder-slate-400 text-slate-900 rounded-md focus:outline-none focus:ring-hostel-blue-500 focus:border-hostel-blue-500 sm:text-sm";
    const errorTextStyle = "text-red-500 text-xs mt-1 px-1";

    return (
        <div className="bg-slate-50 min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-lg">
                <div>
                    <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-600 hover:text-hostel-blue-600 mb-6">
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Login
                    </button>
                    <h2 className="text-center text-3xl font-extrabold text-slate-900">
                        Create Student Account
                    </h2>
                </div>
                <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
                    <div className="space-y-4">
                        <div>
                            <input name="name" type="text" required className={inputStyle} placeholder="Name" value={formData.name} onChange={handleChange} />
                            {errors.name && <p className={errorTextStyle}>{errors.name}</p>}
                        </div>
                        <div>
                            <input name="phone" type="tel" maxLength={10} required className={inputStyle} placeholder="Phone Number (10 digits)" value={formData.phone} onChange={handleChange} />
                            {errors.phone && <p className={errorTextStyle}>{errors.phone}</p>}
                        </div>
                        <div>
                            <input name="email" type="email" required className={inputStyle} placeholder="Email Address" value={formData.email} onChange={handleChange} />
                            {errors.email && <p className={errorTextStyle}>{errors.email}</p>}
                        </div>
                         <div>
                            <input name="roomNo" type="text" maxLength={3} required className={inputStyle} placeholder="Room No (3 digits)" value={formData.roomNo} onChange={handleChange} />
                            {errors.roomNo && <p className={errorTextStyle}>{errors.roomNo}</p>}
                        </div>
                        <select name="courseName" required className={inputStyle} value={formData.courseName} onChange={handleChange}>
                            <option value="" disabled>Select Course Name</option>
                            {courses.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select name="departmentName" required className={inputStyle} value={formData.departmentName} onChange={handleChange}>
                             <option value="" disabled>Select Department Name</option>
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <input name="password" type="password" required className={inputStyle} placeholder="Password" value={formData.password} onChange={handleChange} />
                        <div className="relative">
                            <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required className={inputStyle} placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
                            </button>
                        </div>
                        {errors.password && <p className={errorTextStyle}>{errors.password}</p>}
                    </div>
                    <div>
                        {errors.general && <p className="text-red-500 text-sm text-center mb-4">{errors.general}</p>}
                        <button type="submit" disabled={isLoading} className="mt-4 group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-hostel-green-600 hover:bg-hostel-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-hostel-green-500 disabled:bg-hostel-green-300 disabled:cursor-not-allowed">
                            {isLoading ? <SpinnerIcon className="w-5 h-5" /> : 'Sign up'}
                        </button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <button onClick={onSwitchToLogin} className="font-medium text-hostel-blue-600 hover:text-hostel-blue-500">
                        Already have an account? Log in
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentSignup;