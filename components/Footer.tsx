
import React from 'react';

// FIX: Implement the Footer component
const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="container mx-auto px-6 py-4 text-center text-slate-500 text-sm">
                <p>&copy; {new Date().getFullYear()} HostelWash. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
