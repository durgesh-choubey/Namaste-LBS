
import React from 'react';

interface AnalyticsCardProps {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    change?: string;
    changeType?: 'increase' | 'decrease';
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ icon, title, value, change, changeType }) => {
    const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 flex items-start gap-4">
            <div className="bg-hostel-blue-100 p-3 rounded-full flex-shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
                {change && (
                    <p className={`text-xs mt-1 ${changeColor}`}>
                        {change}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AnalyticsCard;
