
// features/farmer/MobileHeader.tsx
// คอมโพเนนต์ส่วนหัว (Header) สำหรับมุมมองบนมือถือ

import React, { useRef, useEffect } from 'react';
import { Profile, Notification } from '../../types';
import * as Icons from '../../constants';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface MobileHeaderProps {
    profile: Profile;
    unreadCount: number;
    isNotificationOpen: boolean;
    setNotificationOpen: (isOpen: boolean) => void;
    notifications: Notification[];
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ profile, unreadCount, isNotificationOpen, setNotificationOpen, notifications }) => {
    // Ref สำหรับอ้างอิงถึง element ต่างๆ เพื่อจัดการการคลิก
    const notificationRef = useRef<HTMLDivElement>(null); // Dropdown
    const triggerRef = useRef<HTMLButtonElement>(null);  // ปุ่มกระดิ่ง

    // useEffect สำหรับจัดการการคลิกนอก dropdown เพื่อปิด
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target as Node) &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node)
            ) {
                setNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [setNotificationOpen]);

    return (
        // `fixed` และ `z-40` เพื่อให้ header อยู่ด้านบนสุดเสมอ
        <header className="fixed top-0 left-0 right-0 z-40 h-[70px] bg-gradient-to-r from-[#A1B076] to-[#8D9A6A] text-white shadow-lg">
            <div className="flex items-center justify-between h-full px-4">
                {/* ส่วนข้อมูลผู้ใช้ (ซ้าย) */}
                <div className="flex items-center space-x-3">
                    <img src={profile.avatarUrl} alt={`${profile.firstName} ${profile.lastName}`} className="w-12 h-12 rounded-full border-2 border-white/50 object-cover" />
                    <div>
                        <h1 className="font-bold text-base leading-tight">สวัสดี, {profile.firstName}</h1>
                        <p className="text-sm text-white/80">ภาพรวมสวนไผ่ของคุณ</p>
                    </div>
                </div>

                {/* ส่วนการแจ้งเตือน (ขวา) */}
                <div className="relative">
                    <button ref={triggerRef} onClick={() => setNotificationOpen(!isNotificationOpen)} className="relative">
                        <Icons.BellIcon className="h-8 w-8 text-white" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {/* Dropdown การแจ้งเตือน */}
                    {isNotificationOpen && (
                        <div ref={notificationRef} className="absolute top-full right-0 mt-3 w-80 bg-white rounded-xl border-2 border-slate-200 shadow-2xl z-20">
                            <div className="p-4 border-b border-gray-200">
                                <h4 className="font-bold text-slate-900">การแจ้งเตือน</h4>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notif => (
                                        <div key={notif.id} className={`flex items-start space-x-4 p-4 border-b border-gray-200 last:border-b-0 transition-colors duration-150 ${!notif.read ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                                            <div className="flex-shrink-0 text-slate-600 mt-1"><notif.icon className="h-6 w-6" /></div>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-sm text-slate-800">{notif.title}</p>
                                                <p className="text-sm text-slate-700">{notif.message}</p>
                                                <p className="text-xs text-slate-500 mt-1">{notif.date}</p>
                                            </div>
                                            {!notif.read && <div className="flex-shrink-0 w-2.5 h-2.5 bg-red-500 rounded-full mt-2 self-center"></div>}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-slate-600">ไม่มีการแจ้งเตือน</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default MobileHeader;
