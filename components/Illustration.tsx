
import React from 'react';

const Illustration: React.FC = () => {
    return (
        <svg viewBox="0 0 500 400" xmlns="http://www.w3.org/2000/svg">
            {/* Background elements */}
            <rect x="0" y="0" width="500" height="400" fill="#e0f2fe" />
            <circle cx="80" cy="80" r="100" fill="#bbf7d0" opacity="0.5" />
            <circle cx="450" cy="350" r="120" fill="#bae6fd" opacity="0.6" />

            {/* Floor */}
            <path d="M0 350 H500 V400 H0 Z" fill="#f1f5f9" />
            <path d="M0 350 H500" stroke="#cbd5e1" strokeWidth="2" />

            {/* Washing Machine 1 */}
            <rect x="280" y="200" width="90" height="150" rx="10" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            <rect x="285" y="205" width="80" height="20" rx="5" fill="#e2e8f0" />
            <circle cx="325" cy="275" r="30" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" opacity="0.3" />
            <circle cx="325" cy="275" r="25" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="345" cy="220" r="3" fill="#22c55e" />

            {/* Washing Machine 2 */}
            <rect x="380" y="200" width="90" height="150" rx="10" fill="#ffffff" stroke="#94a3b8" strokeWidth="2" />
            <rect x="385" y="205" width="80" height="20" rx="5" fill="#e2e8f0" />
            <circle cx="425" cy="275" r="30" fill="#0ea5e9" stroke="#0284c7" strokeWidth="2" opacity="0.3" />
            <circle cx="425" cy="275" r="25" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="445" cy="220" r="3" fill="#f59e0b" />

             {/* Person 1 (Student) */}
            <g transform="translate(100, 180)">
                {/* Legs */}
                <rect x="45" y="110" width="10" height="60" fill="#075985" />
                <rect x="65" y="110" width="10" height="60" fill="#075985" />
                {/* Body */}
                <rect x="40" y="50" width="40" height="65" rx="10" fill="#22c55e" />
                <path d="M40 60 H80" stroke="#ffffff" strokeWidth="3" />
                 {/* Head */}
                <circle cx="60" cy="30" r="20" fill="#fde68a" />
                <path d="M 50 20 C 55 10, 65 10, 70 20" fill="none" stroke="#4b5563" strokeWidth="2"/>
            </g>

            {/* Person 2 (Student with phone) */}
            <g transform="translate(180, 190)">
                {/* Legs */}
                <rect x="45" y="100" width="10" height="60" fill="#475569" />
                <rect x="65" y="100" width="10" height="60" fill="#475569" />
                {/* Body */}
                <rect x="40" y="40" width="40" height="65" rx="10" fill="#60a5fa" />
                 {/* Head */}
                <circle cx="60" cy="20" r="20" fill="#fde047" />
                 {/* Hair */}
                <path d="M40 20 Q 60 -5, 80 20 Z" fill="#78350f" />
                {/* Phone */}
                <rect x="75" y="60" width="15" height="25" rx="3" fill="#1e293b" />
                <circle cx="82.5" cy="80" r="1.5" fill="#f8fafc" />
            </g>

            {/* Laundry Basket */}
            <path d="M30 310 L 40 350 H 90 L 100 310 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
            <path d="M40 320 H 90" stroke="#d97706" strokeWidth="1.5" />
            <path d="M40 335 H 90" stroke="#d97706" strokeWidth="1.5" />

        </svg>
    );
};

export default Illustration;
