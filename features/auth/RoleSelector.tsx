// features/auth/RoleSelector.tsx
// คอมโพเนนต์สำหรับหน้าจอเลือกบทบาท (Role) ของผู้ใช้
// เป็นหน้าแรกที่ผู้ใช้จะเห็นก่อนเข้าสู่ระบบ

import React from 'react';
import { UserRole } from '../../types';
import * as Icons from '../../constants';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface RoleSelectorProps {
    onSelectRole: (role: UserRole) => void; // ฟังก์ชันที่จะทำงานเมื่อผู้ใช้เลือกบทบาท
    onStartRegistration: () => void; // ฟังก์ชันสำหรับเริ่มการสมัครสมาชิก
    onTestNotApproved: () => void; // ฟังก์ชันสำหรับทดสอบหน้า "ไม่อนุมัติ"
}

// คอมโพเนนต์ย่อยสำหรับปุ่มเลือก Role
const RoleButton: React.FC<{role: UserRole, emoji: string, onClick: () => void}> = ({ role, emoji, onClick }) => (
    <button 
        onClick={onClick} 
        className="group text-center p-8 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-lg h-full flex flex-col items-center justify-center"
    >
        <div className="text-5xl mb-4">{emoji}</div>
        <span className="text-xl font-bold text-slate-800">{role}</span>
    </button>
);


const RoleSelector: React.FC<RoleSelectorProps> = ({ onSelectRole, onStartRegistration, onTestNotApproved }) => (
    <div 
        className="flex flex-col items-center justify-center min-h-screen bg-slate-100 p-4 relative"
        style={{
            backgroundImage: "url('/Group.png')",
            backgroundPosition: 'bottom center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain'
        }}
    >
        
        {/* ส่วนโลโก้และชื่อแอป */}
        <div className="text-center mb-12">
            <Icons.PreciseLogo className="h-20 w-auto mx-auto mb-4" />
            <p className="text-slate-600 mt-2 text-lg">แพลตฟอร์มสำหรับภาคการเกษตร</p>
        </div>

        {/* กล่องสำหรับเลือก Role */}
        <div className="bg-white/60 backdrop-blur-sm p-10 rounded-2xl shadow-xl border border-gray-200 w-full max-w-4xl">
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">กรุณาเลือกบทบาทของคุณ</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* คอลัมน์สำหรับเกษตรกร */}
                <div className="flex flex-col gap-4">
                    <RoleButton role={UserRole.FARMER} emoji="🧑‍🌾" onClick={() => onSelectRole(UserRole.FARMER)} />
                    <button
                        onClick={onStartRegistration}
                        className="text-center py-3 px-4 rounded-xl bg-[#54B948] text-white hover:bg-green-600 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-xl font-semibold"
                    >
                        สมัครสมาชิก (สำหรับเกษตรกร)
                    </button>
                     {/* ปุ่มทดสอบหน้า "ไม่อนุมัติ" */}
                    <button
                        onClick={onTestNotApproved}
                        className="text-center py-3 px-4 rounded-xl bg-[#F08080] text-black hover:bg-red-500 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-xl font-semibold border border-black"
                    >
                        (Test) ดูหน้า "ไม่อนุมัติ"
                    </button>
                </div>
                 {/* คอลัมน์สำหรับโรงงาน */}
                <RoleButton role={UserRole.FACTORY} emoji="🏭" onClick={() => onSelectRole(UserRole.FACTORY)} />
                 {/* คอลัมน์สำหรับแอดมิน */}
                <RoleButton role={UserRole.ADMIN} emoji="👑" onClick={() => onSelectRole(UserRole.ADMIN)} />
            </div>
        </div>
    </div>
);

export default RoleSelector;