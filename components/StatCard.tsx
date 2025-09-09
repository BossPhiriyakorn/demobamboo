// components/StatCard.tsx
// คอมโพเนนต์การ์ดสำหรับแสดงข้อมูลทางสถิติโดยเฉพาะ
// ใช้คอมโพเนนต์ Card เป็นพื้นฐานและเพิ่ม layout สำหรับแสดงค่าและไอคอน

import React from 'react';
import Card from './Card';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface StatCardProps {
    title: string;        // ชื่อหัวข้อของสถิติ
    value: string;        // ค่าของสถิติ
    unit: string;         // หน่วยของสถิติ
    icon: React.ReactNode; // ไอคอนที่จะแสดง
    staggerIndex?: number; // index สำหรับอนิเมชัน
}

const StatCard: React.FC<StatCardProps> = ({ title, value, unit, icon, staggerIndex }) => (
    // ใช้ Card component เป็นตัวหุ้ม และส่ง staggerIndex ต่อไป
    <Card className="relative flex flex-col justify-between h-48" staggerIndex={staggerIndex}>
        {/* ไอคอนจะอยู่มุมบนขวา */}
        <div className="absolute top-3 right-3 text-slate-600">{icon}</div>
        
        {/* ส่วนหัวข้อ */}
        <div>
            <p className="text-slate-800">{title}</p>
        </div>

        {/* ส่วนแสดงค่าและหน่วย */}
        <div className="text-right text-gray-900">
            <span className="text-6xl font-bold">{value}</span>
            <span className="text-xl font-semibold ml-2">{unit}</span>
        </div>
    </Card>
);

export default StatCard;