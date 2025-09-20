import React from 'react';
import Illustration from './Illustration';
import UserIcon from './icons/UserIcon';
import MailIcon from './icons/MailIcon';

interface HeroProps {
    onSelectLogin: (role: 'student' | 'admin') => void;
}

const Hero: React.FC<HeroProps> = ({ onSelectLogin }) => {
    return (
        <div className="container mx-auto px-6 py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight">
                        Effortless Laundry for Hostel Life
                    </h1>
                    <p className="mt-4 text-lg text-slate-600 max-w-lg mx-auto md:mx-0">
                        Book your washing machine slot in seconds. No more waiting, no more hassle. Just clean clothes when you need them.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                        <button 
                            onClick={() => onSelectLogin('student')}
                            className="flex items-center justify-center gap-3 bg-hostel-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-hostel-green-700 transition-transform transform hover:scale-105"
                        >
                            <UserIcon className="w-5 h-5" />
                            <span>Login as Student</span>
                        </button>
                         <button 
                            onClick={() => onSelectLogin('admin')}
                            className="flex items-center justify-center gap-3 bg-slate-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-slate-800 transition-transform"
                        >
                            <MailIcon className="w-5 h-5" />
                            <span>Login as Admin</span>
                        </button>
                    </div>
                </div>
                <div className="hidden md:block">
                   <Illustration />
                </div>
            </div>
        </div>
    );
};

export default Hero;
