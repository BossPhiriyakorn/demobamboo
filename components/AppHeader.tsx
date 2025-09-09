// components/AppHeader.tsx
// คอมโพเนนต์ส่วนหัว (Header) สำหรับหน้าจอเดสก์ท็อป

import React from 'react';
import { NavItem, Page, UserRole } from '../types';
import * as Icons from '../constants';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface AppHeaderProps {
    navItems: NavItem[];          // รายการเมนู
    activePage: Page;             // หน้าที่กำลังเปิดใช้งานอยู่
    onNavClick: (page: Page) => void; // ฟังก์ชันเมื่อคลิกเมนู
    onLogout: () => void;         // ฟังก์ชันสำหรับ Logout
    role: UserRole;               // บทบาทของผู้ใช้
}

const AppHeader: React.FC<AppHeaderProps> = ({ navItems, activePage, onNavClick, onLogout, role }) => (
    // ซ่อน header นี้ในมุมมองมือถือ (แสดงเฉพาะ md ขึ้นไป)
    <div className="hidden md:block">
        <header className="bg-[#009DD4] text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* ส่วนโลโก้ */}
                    <div className="flex items-center">
                        <Icons.PreciseLogo className="h-10 w-auto" />
                    </div>
                    
                    {/* ส่วนเมนูนำทาง */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {navItems.map(item => (
                            <button 
                                key={item.page} 
                                onClick={() => onNavClick(item.page)} 
                                //- เปลี่ยนสไตล์ตามหน้าที่ active อยู่
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    activePage === item.page ? 'bg-white/20' : 'hover:bg-white/10'
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.page}</span>
                            </button>
                        ))}
                    </nav>

                    {/* ส่วนแสดงบทบาทและปุ่ม Logout */}
                    <div className="flex items-center space-x-4">
                        <div className="font-semibold text-sm hidden sm:block">{role}</div>
                        <button onClick={onLogout} className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-white/10">
                            <Icons.LogoutIcon className="h-5 w-5" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    </div>
);

export default AppHeader;