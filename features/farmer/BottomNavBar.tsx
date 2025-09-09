// features/farmer/BottomNavBar.tsx
// คอมโพเนนต์เมนูบาร์ด้านล่าง (Bottom Navigation Bar) สำหรับมุมมองมือถือ
// มีอนิเมชันวงกลมเลื่อนตามเมนูที่เลือก (Sliding Indicator)

import React from 'react';
import { NavItem, Page } from '../../types';

// Props ที่คอมโพเนนตต้องการ
interface BottomNavBarProps {
    navItems: NavItem[];          // รายการเมนูทั้งหมด
    activePage: Page;             // หน้าที่กำลังเปิดใช้งาน
    onNavClick: (page: Page) => void; // ฟังก์ชันเมื่อคลิกเมนู
}

const BottomNavBar: React.FC<BottomNavBarProps> = ({ navItems, activePage, onNavClick }) => {
    // กำหนดลำดับการแสดงผลของไอคอนในเมนูให้คงที่ เพื่อให้ index ถูกต้องเสมอ
    const orderedNavItems = [
        navItems.find(i => i.page === Page.BOOKING),
        navItems.find(i => i.page === Page.FINANCE),
        navItems.find(i => i.page === Page.DASHBOARD),
        navItems.find(i => i.page === Page.KNOWLEDGE),
        navItems.find(i => i.page === Page.PROFILE),
    ].filter((item): item is NavItem => !!item); // filter(Boolean) เพื่อกรองค่า undefined ออก

    // หา index ของหน้าที่ active อยู่
    const activeIndex = orderedNavItems.findIndex(item => item.page === activePage);

    // คำนวณตำแหน่งของวงกลม indicator
    // มี 5 ไอคอน จุดกึ่งกลางจะอยู่ที่ 10%, 30%, 50%, 70%, 90%
    const indicatorPosition = activeIndex !== -1 ? `${activeIndex * 20 + 10}%` : '50%';

    return (
        // `fixed bottom-4` ทำให้เมนูลอยอยู่ด้านล่าง
        // `left-1/2 -translate-x-1/2` จัดให้อยู่กึ่งกลางแนวนอน
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-sm h-16 bg-white rounded-full shadow-2xl shadow-slate-400/30 z-50 border border-slate-200">
            <div className="relative flex items-center justify-around h-full">
                
                {/* วงกลม Indicator ที่เลื่อนได้ */}
                <div
                    className="absolute z-0 w-14 h-14 bg-[#54B948] rounded-full transition-all duration-300 ease-in-out shadow-inner"
                    style={{
                        left: indicatorPosition,
                        top: '0.25rem', // จัดให้อยู่กึ่งกลางแนวตั้ง (h-16 -> h-14)
                        transform: 'translateX(-50%)', // เลื่อนไปทางซ้าย 50% ของความกว้างตัวเองเพื่อให้จุดกึ่งกลางตรง
                    }}
                />

                {/* ปุ่มเมนูต่างๆ (z-10 เพื่อให้แสดงทับ indicator) */}
                {orderedNavItems.map((item, index) => {
                    const isActive = activeIndex === index;
                    return (
                        <button
                            key={item.page}
                            onClick={() => onNavClick(item.page)}
                            className="relative z-10 flex flex-col items-center justify-center w-16 h-16 rounded-full focus:outline-none"
                            aria-label={item.page}
                        >
                            <item.icon
                                className={`h-7 w-7 transition-colors duration-200 ${
                                    isActive ? 'text-white' : 'text-slate-500' // ไอคอนที่ active จะเป็นสีขาว
                                }`}
                            />
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavBar;