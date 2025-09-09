// components/BookingList.tsx
// คอมโพเนนต์สำหรับแสดงรายการจองคิว

import React from 'react';
import { Booking, BookingStatus } from '../types';
import Card from './Card';
import * as Icons from '../constants';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface BookingListProps {
    bookings: Booking[];                     // รายการการจองทั้งหมด
    title?: string;                          // หัวข้อ (ถ้าไม่ระบุ จะใช้ค่า default)
    onViewDetails?: (booking: Booking) => void; // ฟังก์ชัน callback เมื่อคลิกปุ่ม "ดูรายละเอียด"
}

const BookingList: React.FC<BookingListProps> = ({ bookings, title = "รายการจองคิว", onViewDetails }) => (
    <Card>
        <h2 className="text-2xl font-bold mb-4 text-slate-900">{title}</h2>
        <div className="space-y-4">
            {bookings.map(b => (
                <div key={b.id} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr_auto] gap-x-4 gap-y-3 items-center border-b border-gray-200 pb-3 last:border-b-0">
                    {/* แสดงวันที่ */}
                    <div className="text-slate-800">{b.date}</div>
                    
                    {/* แสดงรายละเอียด */}
                    <div className="font-semibold text-slate-900">
                        {/* ถ้ามี farmerName ให้แสดงชื่อและรายละเอียด */}
                        {b.farmerName ? (
                            <div>
                                <p>{b.farmerName}</p>
                                <p className="text-sm font-normal text-slate-600">{b.description}</p>
                            </div>
                        ) : (
                           b.description
                        )}
                    </div>
                    
                    {/* แสดงสถานะ (เปลี่ยนสีตามสถานะ) */}
                    <div className={`md:text-right font-bold ${b.status === BookingStatus.COMPLETED ? 'text-green-600' : b.status === BookingStatus.CONFIRMED ? 'text-blue-600' : 'text-orange-500'}`}>{b.status}</div>
                    
                    {/* ปุ่มดูรายละเอียด (จะแสดงก็ต่อเมื่อมี prop onViewDetails) */}
                    <div className="md:text-right">
                        {onViewDetails && (
                            <button
                                onClick={() => onViewDetails(b)}
                                className="bg-amber-100 hover:bg-amber-200 text-black text-sm font-bold py-2 px-4 rounded-lg border border-black flex items-center space-x-2 justify-center w-full md:w-auto"
                            >
                                <Icons.EyeIcon className="h-4 w-4" />
                                <span>ดูรายละเอียด</span>
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

export default BookingList;