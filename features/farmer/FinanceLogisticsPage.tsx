// features/farmer/FinanceLogisticsPage.tsx
// คอมโพเนนต์สำหรับหน้าการเงินและการขนส่งของเกษตรกร

import React, { useState } from 'react';
import { Shipment, Payment, ShipmentStatus, PaymentStatus } from '../../types';
import * as Icons from '../../constants';
import Card from '../../components/Card';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface FinanceLogisticsPageProps {
    shipments: Shipment[]; // รายการขนส่ง
    payments: Payment[];   // รายการชำระเงิน
}

const FinanceLogisticsPage: React.FC<FinanceLogisticsPageProps> = ({ shipments, payments }) => {
    // State สำหรับควบคุมแท็บที่กำลังแสดงผล (ขนส่ง หรือ การเงิน)
    const [activeTab, setActiveTab] = useState<'shipping' | 'payment'>('shipping');
    // State สำหรับควบคุมจำนวนรายการขนส่งที่แสดง (สำหรับ "โหลดเพิ่มเติม")
    const [visibleShipments, setVisibleShipments] = useState(3);

    // ฟังก์ชันโหลดรายการขนส่งเพิ่มเติม
    const handleLoadMore = () => {
        setVisibleShipments(prev => prev + 5);
    };
    
    // จัดการข้อมูลวันที่ปัจจุบัน
    const today = new Date();
    const formattedToday = today.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace('พ.ศ. ','');

    // === คอมโพเนนต์ Stepper สำหรับแสดงสถานะการขนส่ง ===
    const Stepper: React.FC<{status: ShipmentStatus}> = ({status}) => {
        const steps = [
            { id: ShipmentStatus.PREPARING, label: 'รับสินค้าแล้ว' },
            { id: ShipmentStatus.IN_TRANSIT, label: 'กำลังนำส่ง' },
            { id: ShipmentStatus.DELIVERED, label: 'ถึงปลายทางเรียบร้อย' },
        ];
        // หา index ของสถานะปัจจุบัน
        const currentIndex = steps.findIndex(s => s.id === status);

        return (
            <div className="flex items-start w-full mt-6 text-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        {/* จุดวงกลมและข้อความ */}
                        <div className="flex flex-col items-center flex-shrink-0 w-28">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${index <= currentIndex ? 'bg-green-500 border-green-600' : 'bg-gray-300 border-gray-400'}`}>
                                {index <= currentIndex && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                            </div>
                            <p className={`mt-2 text-xs font-semibold ${index <= currentIndex ? 'text-slate-800' : 'text-gray-500'}`}>{step.label}</p>
                        </div>
                        {/* เส้นเชื่อมระหว่างจุด */}
                        {index < steps.length - 1 && (
                            <div className={`flex-auto border-t-2 mt-4 ${index < currentIndex ? 'border-green-500' : 'border-gray-300'}`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* ส่วนหัวของหน้า */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900">การเงินและการขนส่ง</h1>
                <p className="text-slate-800">ติดตามสถานะการขนส่งและรายรับของคุณ</p>
            </div>
            {/* แท็บสำหรับเลือกมุมมอง */}
            <div className="flex space-x-2 bg-amber-200/50 p-1 rounded-lg border border-black max-w-md">
                <button onClick={() => setActiveTab('shipping')} className={`w-1/2 py-2 rounded-md font-semibold text-slate-900 ${activeTab === 'shipping' ? 'bg-amber-300 shadow' : ''}`}>ติดตามการขนส่ง</button>
                <button onClick={() => setActiveTab('payment')} className={`w-1/2 py-2 rounded-md font-semibold text-slate-900 ${activeTab === 'payment' ? 'bg-amber-300 shadow' : ''}`}>ประวัติการรับเงิน</button>
            </div>
            <Card>
                {/* เนื้อหาแท็บ "ติดตามการขนส่ง" */}
                {activeTab === 'shipping' && (
                    <div className="space-y-6">
                        {shipments.slice(0, visibleShipments).map(s => (
                            <div key={s.id} className="bg-white p-6 rounded-lg border border-gray-300 text-slate-800">
                                <h3 className="font-bold text-lg text-slate-900">{s.title}</h3>
                                <p className="text-sm text-slate-700">วันที่จัดส่ง: {s.date === formattedToday ? 'วันนี้' : s.date}</p>
                                <div className="flex justify-between mt-4">
                                    <div><span className="font-semibold text-slate-900">จาก:</span> {s.from}</div>
                                    <div><span className="font-semibold text-slate-900">ถึง:</span> {s.to}</div>
                                </div>
                                <Stepper status={s.status}/>
                            </div>
                        ))}
                         {visibleShipments < shipments.length && (
                            <div className="text-center">
                                <button
                                    onClick={handleLoadMore}
                                    className="bg-amber-100 hover:bg-amber-200 text-black font-bold py-2 px-6 rounded-lg border border-black transition-all"
                                >
                                    แสดงเพิ่มเติม
                                </button>
                            </div>
                        )}
                    </div>
                )}
                {/* เนื้อหาแท็บ "ประวัติการรับเงิน" */}
                {activeTab === 'payment' && (
                    <div className="space-y-4">
                        {payments.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                               <div className="flex items-center space-x-4">
                                    <div className="bg-amber-100 p-3 rounded-full">
                                        <Icons.CashIcon className="h-6 w-6 text-amber-700"/>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{p.description}</p>
                                        <p className="text-sm text-slate-700">วันที่: {p.date}</p>
                                    </div>
                               </div>
                               <div>
                                    <p className="font-bold text-lg text-green-600">{p.amount}</p>
                                    <p className={`text-right font-semibold ${p.status === PaymentStatus.PAID ? 'text-green-500' : 'text-orange-500'}`}>{p.status}</p>
                               </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default FinanceLogisticsPage;