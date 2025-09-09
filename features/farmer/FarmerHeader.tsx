// features/farmer/FarmerHeader.tsx
// คอมโพเนนต์ส่วนหัว (Header) สำหรับมุมมองเกษตรกร (ใหม่)
// มีดีไซน์พื้นหลังและแสดงชื่อของหน้าปัจจุบัน

import React from 'react';
import * as Icons from '../../constants';

// Props
interface FarmerHeaderProps {
    title: string;
    onMenuClick: () => void;
    onNotificationClick: () => void;
}

const FarmerHeader: React.FC<FarmerHeaderProps> = ({ title, onMenuClick, onNotificationClick }) => {
    return (
        <div 
            className="relative h-40 bg-cover bg-center rounded-b-3xl text-white px-4 pt-6"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1559827291-72ee739d0d95?q=80&w=1974&auto=format&fit=crop')" }}
        >
            <div className="absolute inset-0 bg-black/30 rounded-b-3xl"></div>
            <div className="relative z-10 flex items-center justify-between">
                {/* Left side: Hamburger Menu */}
                <button 
                    onClick={onMenuClick}
                    className="p-2"
                >
                    <Icons.Bars3Icon className="w-7 h-7 text-white"/>
                </button>
                
                {/* Center: Page Title */}
                <h1 className="text-xl font-bold">{title}</h1>
                
                {/* Right side: Notification Bell */}
                <div className="relative">
                    <button onClick={onNotificationClick} className="bg-white/95 p-3 rounded-full shadow-md">
                        <Icons.BellIcon className="w-6 h-6 text-slate-700" />
                    </button>
                    <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
                </div>
            </div>
        </div>
    );
};

export default FarmerHeader;