// components/ConfirmationModal.tsx
// คอมโพเนนต์หน้าต่างยืนยัน (Confirmation Modal) ที่สามารถนำไปใช้ซ้ำได้

import React from 'react';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface ConfirmationModalProps {
    title: string;          // หัวข้อของ Modal
    message: string;        // ข้อความใน Modal
    onConfirm: () => void;  // ฟังก์ชันที่จะทำงานเมื่อกดยืนยัน
    onCancel: () => void;   // ฟังก์ชันที่จะทำงานเมื่อกดยกเลิก
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ title, message, onConfirm, onCancel }) => (
    //- พื้นหลังสีดำโปร่งแสง คลุมทั้งหน้าจอ
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        {/* กล่อง Modal */}
        <div className="bg-white rounded-xl border-2 border-slate-200 shadow-2xl p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-bold mb-2 text-slate-900">{title}</h3>
            <p className="text-slate-800 mb-6">{message}</p>
            {/* ปุ่มยืนยันและยกเลิก */}
            <div className="flex justify-center space-x-4">
                <button onClick={onConfirm} className="bg-[#54B948] hover:bg-green-600 text-white font-bold py-2 px-8 rounded-lg transition-all">ยืนยัน</button>
                <button onClick={onCancel} className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2 px-8 rounded-lg transition-all">ยกเลิก</button>
            </div>
        </div>
    </div>
);

export default ConfirmationModal;