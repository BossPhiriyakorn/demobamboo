// features/admin/UserManagementPage.tsx
// คอมโพเนนต์สำหรับหน้าจัดการผู้ใช้ (เกษตรกร/โรงงาน)

import React, { useState } from 'react';
import { adminUsers } from '../../data/mockData';
import { AdminUser, UserStatus } from '../../types';
import * as Icons from '../../constants';

interface UserManagementPageProps {
    userType: 'เกษตรกร' | 'โรงงาน/ผู้รับซื้อ';
    pageTitle: string;
}

const UserManagementPage: React.FC<UserManagementPageProps> = ({ userType, pageTitle }) => {
    // State สำหรับจัดการแท็บที่กำลังใช้งาน (อนุมัติแล้ว / รออนุมัติ)
    const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');

    // กรองข้อมูลผู้ใช้ตาม userType และแท็บที่เลือก
    const usersToDisplay = userType === 'เกษตรกร' ? adminUsers : [];

    const filteredUsers = usersToDisplay.filter(user => {
        if (activeTab === 'approved') {
            return user.status === UserStatus.ACTIVE || user.status === UserStatus.INACTIVE;
        }
        return user.status === UserStatus.PENDING;
    });

    // คอมโพเนนต์สำหรับแสดงแถบสถานะ
    const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
        const colorClasses = {
            [UserStatus.ACTIVE]: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
            [UserStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
            [UserStatus.INACTIVE]: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
        };
        const { bg, text, dot } = colorClasses[status];
        return (
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${bg} ${text}`}>
                <span className={`w-2 h-2 rounded-full ${dot}`}></span>
                <span>{status}</span>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">{pageTitle}</h1>

            <div className="bg-[#FFFBEB] border-2 border-black rounded-xl shadow-md p-6">
                {/* ส่วนหัว: แท็บและปุ่มเพิ่ม */}
                <div className="flex justify-between items-center mb-6">
                    {/* แท็บ */}
                    <div className="flex space-x-2">
                        <button 
                            onClick={() => setActiveTab('pending')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                                activeTab === 'pending' ? 'bg-amber-300 text-black shadow' : 'bg-amber-100 text-slate-800 hover:bg-amber-200'
                            }`}
                        >
                            รออนุมัติ
                        </button>
                        <button 
                            onClick={() => setActiveTab('approved')}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                                activeTab === 'approved' ? 'bg-amber-300 text-black shadow' : 'bg-amber-100 text-slate-800 hover:bg-amber-200'
                            }`}
                        >
                            อนุมัติแล้ว
                        </button>
                    </div>

                    {/* ปุ่มเพิ่ม */}
                    <button className="flex items-center space-x-2 bg-[#90EE90] hover:bg-green-500 text-black font-bold py-2 px-4 rounded-lg border border-black transition-colors">
                        <Icons.PlusIcon className="w-5 h-5" />
                        <span>เพิ่ม{userType}</span>
                    </button>
                </div>

                {/* ตารางแสดงผล */}
                <div>
                    {/* ส่วนหัวตาราง */}
                    <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 px-4 pb-2 border-b border-gray-300 text-sm font-semibold text-slate-600 uppercase">
                        <span>ชื่อผู้ใช้</span>
                        <span className="text-center">สถานะ</span>
                        <span className="text-center">วันที่ลงทะเบียน</span>
                        <span className="text-right">รายละเอียด</span>
                    </div>

                    {/* รายการผู้ใช้ */}
                    <div className="divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? filteredUsers.map(user => (
                            <div key={user.id} className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 items-center px-4 py-4 hover:bg-amber-50 transition-colors">
                                <div className="flex items-center space-x-4">
                                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-gray-800 ${user.avatarColor}`}>
                                        {user.avatarInitials}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{user.name}</p>
                                        <p className="text-sm text-slate-600">{user.email}</p>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <StatusBadge status={user.status} />
                                </div>
                                <div className="text-center text-slate-600">
                                    {user.registrationDate}
                                </div>
                                <div className="text-right">
                                    <button className="text-sm font-semibold text-slate-600 hover:text-black">
                                        ดูรายละเอียด
                                    </button>
                                </div>
                            </div>
                        )) : (
                             <tr>
                                <td colSpan={4} className="text-center py-10 text-slate-500">
                                    ไม่มีข้อมูล{userType}
                                </td>
                            </tr>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagementPage;