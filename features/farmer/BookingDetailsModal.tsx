// features/farmer/BookingDetailsModal.tsx
// คอมโพเนนต์หน้าต่าง (Modal) สำหรับแสดงรายละเอียดการจอง

import React from 'react';
import { Booking, BookingStatus, UserRole } from '../../types';
import { MapIcon } from '../../constants';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface BookingDetailsModalProps {
    booking: Booking | null; // ข้อมูลการจองที่จะแสดง หรือ null ถ้าไม่มี
    onClose: () => void;     // ฟังก์ชันสำหรับปิด Modal
}

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose }) => {
    // ถ้า booking เป็น null, ไม่ต้อง render อะไรเลย
    if (!booking) return null;

    // สร้างลิงก์ Google Maps จากที่อยู่
    const mapLink = booking.address ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(booking.address)}` : null;

    return (
        // Overlay พื้นหลัง (z-[60] เพื่อให้แสดงผลทับ UI อื่นๆ)
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
            {/* กล่อง Modal (ใช้ stopPropagation เพื่อไม่ให้การคลิกในกล่องไปปิด Modal) */}
            <div className="bg-white rounded-xl border-2 border-black shadow-2xl p-8 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <h3 className="text-2xl font-bold mb-6 text-center text-slate-900">รายละเอียดการจอง</h3>
                <div className="space-y-4 text-base">

                    {/* Conditional Rendering based on UserType */}
                    {booking.userType === UserRole.FACTORY ? (
                        <>
                            <p className="text-slate-900"><strong className="w-32 inline-block font-semibold">โรงงาน:</strong> {booking.userName}</p>
                            <p className="text-slate-900"><strong className="w-32 inline-block font-semibold">ติดต่อเกษตรกร:</strong> {booking.farmerName}</p>
                        </>
                    ) : (
                         <p className="text-slate-900"><strong className="w-32 inline-block font-semibold">เกษตรกร:</strong> {booking.userName}</p>
                    )}
                    
                    <p className="text-slate-900"><strong className="w-32 inline-block font-semibold">ประเภทผู้ใช้:</strong> {booking.userType}</p>
                    <p className="text-slate-900"><strong className="w-32 inline-block font-semibold">รายละเอียด:</strong> {booking.description}</p>
                    
                    {/* Address and Map Link (relevant for both, points to farmer) */}
                    {booking.address && (
                        <>
                            <div className="flex items-start">
                                <strong className="w-32 inline-block font-semibold flex-shrink-0">ที่อยู่:</strong>
                                <span className="flex-grow">{booking.address}</span>
                            </div>
                             {mapLink && (
                                <div className="flex items-center">
                                    <strong className="w-32 inline-block font-semibold">แผนที่:</strong>
                                    <a
                                        href={mapLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline font-normal flex items-center space-x-1"
                                    >
                                        <MapIcon className="w-4 h-4" />
                                        <span>เปิดใน Google Maps</span>
                                    </a>
                                </div>
                            )}
                        </>
                    )}

                    <p className="text-slate-900"><strong className="w-32 inline-block font-semibold">วันที่นัดหมาย:</strong> {booking.date}</p>
                    <div className="flex items-center">
                        <strong className="w-32 inline-block font-semibold">สถานะ:</strong>
                        <span className={`font-bold ${
                            booking.status === BookingStatus.COMPLETED ? 'text-green-600' :
                            booking.status === BookingStatus.CONFIRMED ? 'text-blue-600' :
                            'text-orange-500'
                        }`}>
                            {booking.status}
                        </span>
                    </div>
                </div>
                <div className="flex justify-end mt-8">
                    <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-8 rounded-lg border border-black transition-all">
                        ปิด
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingDetailsModal;