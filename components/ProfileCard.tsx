import React from 'react';
import { User } from '../App';
import BuildingOfficeIcon from './icons/BuildingOfficeIcon';
import AcademicCapIcon from './icons/AcademicCapIcon';
import BookOpenIcon from './icons/BookOpenIcon';
import UserIcon from './icons/UserIcon';
import PencilIcon from './icons/PencilIcon';

interface ProfileCardProps {
    user: User;
    onEditClick: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, onEditClick }) => {
    const profileItems = [
        { icon: <UserIcon className="w-5 h-5 text-hostel-blue-600" />, label: 'Name', value: user.name },
        { icon: <BuildingOfficeIcon className="w-5 h-5 text-hostel-blue-600" />, label: 'Room No.', value: user.roomNo },
        { icon: <AcademicCapIcon className="w-5 h-5 text-hostel-blue-600" />, label: 'Course', value: user.courseName },
        { icon: <BookOpenIcon className="w-5 h-5 text-hostel-blue-600" />, label: 'Department', value: user.departmentName },
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
            <div className="space-y-4">
                {profileItems.map(item => item.value && (
                    <div key={item.label} className="flex items-center gap-4">
                        <div className="bg-hostel-blue-100 p-2 rounded-full">
                            {item.icon}
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">{item.label}</p>
                            <p className="font-semibold text-slate-700">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 border-t pt-4">
                <button
                    onClick={onEditClick}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-200"
                >
                    <PencilIcon className="w-4 h-4" />
                    <span>Edit Profile</span>
                </button>
            </div>
        </div>
    );
};

export default ProfileCard;