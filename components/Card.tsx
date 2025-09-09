// components/Card.tsx
// คอมโพเนนต์การ์ด (Card) ที่ใช้ร่วมกันทั่วทั้งแอปพลิเคชัน
// มีดีไซน์พื้นฐานและอนิเมชัน fade-in ตอนปรากฏ

import React, { useState, useEffect } from 'react';

// Props ที่คอมโพเนนตต้องการ
interface CardProps {
    children: React.ReactNode; // เนื้อหาภายใน Card
    className?: string;        // class เพิ่มเติมสำหรับ styling
    staggerIndex?: number;     // index สำหรับทำอนิเมชันแบบหน่วงเวลา (stagger)
}

const Card: React.FC<CardProps> = ({ children, className = '', staggerIndex }) => {
    // State สำหรับติดตามว่าควรจะแสดงอนิเมชันแล้วหรือยัง
    const [isAnimated, setIsAnimated] = useState(false);

    // useEffect ใช้สำหรับจัดการ side effect ในที่นี้คือการตั้งเวลาสำหรับอนิเมชัน
    useEffect(() => {
        // คำนวณ delay: ถ้ามี staggerIndex จะหน่วงเวลาตาม index (ใบแรกเริ่มเร็วสุด)
        // ถ้าไม่มี จะมี delay พื้นฐานเล็กน้อย
        const delay = staggerIndex !== undefined ? staggerIndex * 80 : 10;
        
        // ตั้งเวลาให้ state isAnimated เป็น true หลังจาก delay
        const timer = setTimeout(() => {
            setIsAnimated(true);
        }, delay);

        // Cleanup function: ยกเลิก timer เมื่อคอมโพเนนต์ถูก unmount
        // เพื่อป้องกัน memory leak
        return () => clearTimeout(timer);
    }, [staggerIndex]); // Effect นี้จะทำงานใหม่เมื่อ staggerIndex เปลี่ยนไป

    return (
        // กำหนด class สำหรับ styling และอนิเมชัน
        // - isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        //   คือส่วนที่ควบคุมการ fade-in และ slide-up
        <div className={`bg-white rounded-xl shadow-sm p-6 transition-all duration-500 ease-out transform border border-slate-200/80 ${className} ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {children}
        </div>
    );
};

export default Card;