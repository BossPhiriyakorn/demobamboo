// features/farmer/BookingModal.tsx
// คอมโพเนนต์หน้าต่าง (Modal) สำหรับสร้างการจองคิวใหม่
// เป็นแบบ Multi-step (2 ขั้นตอน)

import React, { useState, useMemo } from 'react';

// ประเภทการจองที่มีให้เลือก
const BOOKING_TYPES = [
    'จองคิวรับเมล็ดพันธุ์/ต้นกล้า',
    'จองคิวตัด/เก็บเกี่ยว',
    'จองคิวส่งผลผลิต',
];

// ฟังก์ชันจำลองการดึงวันที่ว่างจากแอดมิน
const getAdminAvailableDates = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = today.getFullYear();
    const month = today.getMonth();
    // วันที่แอดมินกำหนด: 10, 18, 25 ของเดือนปัจจุบัน
    return [10, 18, 25].map(day => new Date(year, month, day));
};

// Props ที่คอมโพเนนต์นี้ต้องการ
interface BookingModalProps {
    isOpen: boolean; // สถานะการเปิด/ปิด Modal
    onClose: () => void; // ฟังก์ชันสำหรับปิด Modal
    onConfirm: (bookingDetails: { description: string; date: string; }) => void; // ฟังก์ชันเมื่อยืนยันการจอง
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, onConfirm }) => {
    // State สำหรับจัดการขั้นตอน, ประเภท, วันที่, และรายละเอียดที่เลือก
    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [details, setDetails] = useState('');

    // `useMemo` เพื่อคำนวณวันที่ว่างเพียงครั้งเดียว (performance optimization)
    const availableDates = useMemo(() => getAdminAvailableDates(), []);
    
    // === Logic การจัดการปฏิทิน ===
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonthDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthName = currentMonthDate.toLocaleString('th-TH', { month: 'long', year: 'numeric' });
    const daysInMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).getDay();
    const calendarDays = Array(firstDayOfMonth).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    const weekdays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    // =============================

    // ฟังก์ชันไปยังขั้นตอนถัดไป
    const handleNextStep = () => {
        if (selectedType) setStep(2);
    };
    
    // ฟังก์ชันยืนยันการจอง
    const handleConfirmClick = () => {
        if (selectedType && selectedDate && details.trim()) {
            onConfirm({
                description: `${selectedType}: ${details}`,
                date: selectedDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace('พ.ศ. ',''),
            });
            resetAndClose();
        }
    };

    // ฟังก์ชันรีเซ็ต state ทั้งหมดและปิด Modal
    const resetAndClose = () => {
        setStep(1);
        setSelectedType('');
        setSelectedDate(null);
        setDetails('');
        onClose();
    };

    if (!isOpen) return null; // ไม่ต้อง render อะไรเลยถ้า Modal ไม่ได้เปิด

    return (
        // Overlay พื้นหลัง
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 p-4 overflow-y-auto" onClick={resetAndClose}>
            {/* กล่อง Modal (ใช้ stopPropagation เพื่อไม่ให้การคลิกในกล่องไปปิด Modal) */}
            <div className="bg-white rounded-xl border-2 border-black shadow-2xl p-6 md:p-8 max-w-xl w-full" onClick={e => e.stopPropagation()}>
                
                {/* === ขั้นตอนที่ 1: เลือกประเภท === */}
                {step === 1 && (
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-center text-slate-900">เลือกประเภทการจองคิว</h3>
                        <div className="space-y-3">
                            {BOOKING_TYPES.map(type => (
                                <button key={type} onClick={() => setSelectedType(type)} className={`w-full text-left p-4 rounded-lg border-2 font-semibold transition-all text-black ${selectedType === type ? 'bg-amber-200 border-black ring-2 ring-amber-400 ring-offset-1' : 'bg-amber-50 border-gray-300 hover:border-black'}`}>
                                    {type}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-end space-x-4 mt-8">
                            <button onClick={resetAndClose} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded-lg border border-black">ยกเลิก</button>
                            <button onClick={handleNextStep} disabled={!selectedType} className="bg-[#90EE90] hover:bg-green-500 text-black font-bold py-2 px-6 rounded-lg border border-black disabled:bg-gray-300 disabled:cursor-not-allowed">ถัดไป</button>
                        </div>
                    </div>
                )}
                
                {/* === ขั้นตอนที่ 2: กรอกรายละเอียดและเลือกวันที่ === */}
                {step === 2 && (
                    <div>
                        <h3 className="text-2xl font-bold mb-1 text-slate-900">รายละเอียดการจอง</h3>
                        <p className="text-slate-600 mb-4">ประเภท: <span className="font-semibold">{selectedType}</span></p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* ช่องกรอกรายละเอียด */}
                            <div>
                                <label htmlFor="details" className="block text-sm font-medium text-slate-700 mb-1">รายละเอียดเพิ่มเติม</label>
                                <textarea id="details" rows={5} value={details} onChange={e => setDetails(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400" placeholder="เช่น จำนวน, ขนาด"></textarea>
                            </div>
                            {/* ปฏิทินเลือกวันที่ */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">เลือกวันที่ว่าง (ตามที่แอดมินกำหนด)</label>
                                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                    <div className="text-center font-bold mb-2 text-slate-800">{monthName}</div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-sm">
                                        {weekdays.map(day => <div key={day} className="font-semibold text-slate-600">{day}</div>)}
                                        {calendarDays.map((day, index) => {
                                            if (!day) return <div key={`empty-${index}`}></div>;
                                            const dayDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day);
                                            const isAvailable = availableDates.some(d => d.toDateString() === dayDate.toDateString()) && dayDate >= today;
                                            const isSelected = selectedDate?.toDateString() === dayDate.toDateString();
                                            
                                            return <button key={day} disabled={!isAvailable} onClick={() => setSelectedDate(dayDate)} className={`w-9 h-9 rounded-full transition-colors flex items-center justify-center ${isSelected ? 'bg-green-500 text-white font-bold' : isAvailable ? 'bg-amber-100 hover:bg-amber-300' : 'text-gray-400 cursor-not-allowed'}`}>{day}</button>;
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-8">
                            <button onClick={() => setStep(1)} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded-lg border border-black">ย้อนกลับ</button>
                            <div className="space-x-4">
                                <button onClick={resetAndClose} className="bg-[#F08080] hover:bg-red-500 text-black font-bold py-2 px-6 rounded-lg border border-black">ยกเลิก</button>
                                <button onClick={handleConfirmClick} disabled={!selectedDate || !details.trim()} className="bg-[#90EE90] hover:bg-green-500 text-black font-bold py-2 px-6 rounded-lg border border-black disabled:bg-gray-300 disabled:cursor-not-allowed">ยืนยันการจอง</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingModal;