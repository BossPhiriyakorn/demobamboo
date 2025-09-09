// features/farmer/FarmerBookingPage.tsx
// คอมโพเนนต์สำหรับหน้าจัดการการจองคิวของเกษตรกร

import React, { useState } from 'react';
import { Booking } from '../../types';
import * as Icons from '../../constants';
import BookingList from '../../components/BookingList';
import BookingModal from './BookingModal';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface FarmerBookingPageProps {
    bookings: Booking[];                                         // รายการจองทั้งหมด
    onAddBooking: (newBookingData: { description: string; date: string; }) => void; // ฟังก์ชันเมื่อเพิ่มการจองใหม่
    onViewDetails: (booking: Booking) => void;                   // ฟังก์ชันเมื่อดูรายละเอียดการจอง
}

const FarmerBookingPage: React.FC<FarmerBookingPageProps> = ({ bookings, onAddBooking, onViewDetails }) => {
    // State สำหรับควบคุมการเปิด/ปิด Modal สร้างการจอง
    const [isModalOpen, setModalOpen] = useState(false);
    // State สำหรับควบคุมจำนวนรายการจองที่แสดงผล (สำหรับฟังก์ชัน "โหลดเพิ่มเติม")
    const [visibleBookings, setVisibleBookings] = useState(8);

    // ฟังก์ชันสำหรับโหลดรายการจองเพิ่มเติม
    const handleLoadMore = () => {
        setVisibleBookings(prev => prev + 5);
    };

    // ฟังก์ชันสำหรับยืนยันการสร้างการจองใหม่
    const handleConfirmBooking = (newBookingData: { description: string; date: string; }) => {
        onAddBooking(newBookingData); // เรียกฟังก์ชันจาก parent component
        setModalOpen(false); // ปิด Modal
    };

    return (
        <div className="space-y-6">
            {/* ส่วนหัวของหน้า */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">ระบบจองคิว</h1>
                    <p className="text-slate-800">จัดการการจองคิวของคุณได้ง่ายดาย</p>
                </div>
                <button 
                    onClick={() => setModalOpen(true)}
                    className="bg-[#F4A460] hover:bg-orange-400 text-black font-bold py-2 px-4 rounded-lg border border-black flex items-center space-x-2">
                    <Icons.PlusIcon className="h-5 w-5"/>
                    <span>สร้างตารางนัดหมายใหม่</span>
                </button>
            </div>

            {/* แสดงรายการจอง */}
            <BookingList bookings={bookings.slice(0, visibleBookings)} onViewDetails={onViewDetails} />
            
            {/* ปุ่ม "แสดงเพิ่มเติม" จะแสดงเมื่อยังมีรายการที่ยังไม่ได้แสดง */}
            {visibleBookings < bookings.length && (
                <div className="text-center">
                    <button
                        onClick={handleLoadMore}
                        className="bg-amber-100 hover:bg-amber-200 text-black font-bold py-2 px-6 rounded-lg border border-black transition-all"
                    >
                        แสดงรายการจองคิวย้อนหลัง
                    </button>
                </div>
            )}

            {/* Modal สำหรับสร้างการจองใหม่ */}
            <BookingModal 
                isOpen={isModalOpen} 
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmBooking} 
            />
        </div>
    );
};

export default FarmerBookingPage;