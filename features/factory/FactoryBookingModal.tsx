// features/factory/FactoryBookingModal.tsx
import React, { useState, useEffect } from 'react';
import { Booking } from '../../types';

interface FactoryBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (bookingData: Partial<Booking>) => void;
    booking: Booking | null;
}

const FactoryBookingModal: React.FC<FactoryBookingModalProps> = ({ isOpen, onClose, onSave, booking }) => {
    const [formData, setFormData] = useState<Partial<Booking>>({});

    useEffect(() => {
        if (isOpen) {
            setFormData(booking || {
                date: '',
                farmerName: '',
                pickupLocation: '',
                estimatedQuantity: '',
                description: '',
            });
        }
    }, [booking, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const InputField: React.FC<{label: string, name: keyof Booking, value: string | undefined, placeholder?: string, required?: boolean}> = ({label, name, value, placeholder, required = true}) => (
        <div>
            <label htmlFor={name} className="block text-sm font-bold text-slate-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            <input type="text" id={name} name={name} value={value || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" placeholder={placeholder} required={required}/>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl border-2 border-black shadow-2xl p-6 md:p-8 max-w-lg w-full" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h3 className="text-xl font-bold mb-6 text-slate-900">{booking ? 'แก้ไขคิวรับซื้อ' : 'เพิ่มคิวรับซื้อใหม่'}</h3>
                    <div className="space-y-4">
                        <InputField label="วันที่" name="date" value={formData.date} placeholder="วว/ดด/ปป" />
                        <InputField label="ชื่อเกษตรกร" name="farmerName" value={formData.farmerName} placeholder="เช่น สมชาย รักการเกษตร" />
                        <InputField label="ที่อยู่เข้ารับ" name="pickupLocation" value={formData.pickupLocation} placeholder="บ้านเลขที่, ตำบล, อำเภอ, จังหวัด" />
                        <InputField label="ปริมาณที่คาดการณ์" name="estimatedQuantity" value={formData.estimatedQuantity} placeholder="เช่น 5 ตัน" />
                        <div>
                            <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-1">รายละเอียดเพิ่มเติม</label>
                            <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400" placeholder="เช่น ชนิดไผ่, คุณภาพ" />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-8">
                        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded-lg border border-black">ยกเลิก</button>
                        <button type="submit" className="bg-[#90EE90] hover:bg-green-500 text-black font-bold py-2 px-6 rounded-lg border border-black">บันทึก</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FactoryBookingModal;