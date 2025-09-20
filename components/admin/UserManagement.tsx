import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../../App';
import SearchIcon from '../icons/SearchIcon';

interface UserManagementProps {
    showToast: (message: string, type: 'success' | 'error') => void;
}

type Student = Omit<User, 'role'>;

const UserManagement: React.FC<UserManagementProps> = ({ showToast }) => {
    const [users, setUsers] = useState<Student[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:3001/api/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data: Student[] = await response.json();
            setUsers(data);
            setFilteredUsers(data);
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const results = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone?.includes(searchTerm) ||
            user.roomNo?.includes(searchTerm)
        );
        setFilteredUsers(results);
    }, [searchTerm, users]);

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                <div className="relative w-full sm:w-64">
                    <input 
                        type="text" 
                        placeholder="Search by name, phone, room..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-hostel-blue-500 focus:border-hostel-blue-500" 
                    />
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Room No.</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Course</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Department</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {isLoading ? (
                            <tr><td colSpan={5} className="text-center p-8 text-slate-500">Loading users...</td></tr>
                        ) : filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.phone}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.roomNo}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.courseName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.departmentName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 { !isLoading && filteredUsers.length === 0 && (
                    <div className="text-center p-8 text-slate-500">
                        {searchTerm ? 'No users match your search.' : 'No student users found.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
