// features/admin/AdminDashboard.tsx
import React, { useState, useMemo } from 'react';
import * as Icons from '../../constants';
import * as mockData from '../../data/mockData';
import { Booking, BookingStatus, Shipment, AdminNews, UserRole } from '../../types';
import Card from '../../components/Card';

const AdminDashboard: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6, 1)); // July 2025
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 15));

    const bookingsByDate = useMemo(() => {
        return mockData.allAdminBookings.reduce((acc, booking) => {
            const dateKey = new Date(parseDate(booking.date)).toDateString();
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(booking);
            return acc;
        }, {} as Record<string, Booking[]>);
    }, []);
    
    const queuesForDay = bookingsByDate[selectedDate.toDateString()] || [];

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
            return newMonth;
        });
    };
    
    // Helper to parse dd/mm/yy
    function parseDate(dateStr: string): Date {
        const parts = dateStr.split('/');
        return new Date(parseInt(parts[2], 10) + 2500 - 543, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }
    
    const Calendar: React.FC = () => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const firstDayOfMonth = monthStart.getDay();
        const calendarDays = Array(firstDayOfMonth).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
        const weekdays = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

        return (
            <Card>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={() => handleMonthChange('prev')} className="p-2 rounded-full hover:bg-slate-100"><Icons.ChevronLeftIcon className="w-5 h-5"/></button>
                    <h3 className="text-base font-bold text-slate-800">{currentMonth.toLocaleString('th-TH', { month: 'long', year: 'numeric' })}</h3>
                    <button onClick={() => handleMonthChange('next')} className="p-2 rounded-full hover:bg-slate-100"><Icons.ChevronRightIcon className="w-5 h-5"/></button>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500">
                    {weekdays.map(day => <div key={day} className="py-2">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 mt-1">
                    {calendarDays.map((day, index) => {
                        if (!day) return <div key={`empty-${index}`}></div>;
                        const dayDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        const isSelected = dayDate.toDateString() === selectedDate.toDateString();
                        const hasBooking = !!bookingsByDate[dayDate.toDateString()];
                        
                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDate(dayDate)}
                                className={`h-9 rounded-lg transition-colors relative text-slate-700 text-sm flex items-center justify-center ${isSelected ? 'bg-[#54B948] text-white font-bold' : 'hover:bg-slate-100'}`}
                            >
                                {day}
                                {hasBooking && <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#009DD4] rounded-full"></div>}
                            </button>
                        );
                    })}
                </div>
            </Card>
        );
    };
    
    const StatusTag: React.FC<{ status: BookingStatus }> = ({ status }) => {
        const styles = {
            [BookingStatus.COMPLETED]: "bg-[#54B948]/20 text-[#54B948]",
            [BookingStatus.CONFIRMED]: "bg-[#009DD4]/20 text-[#009DD4]",
            [BookingStatus.PENDING]: "bg-[#E87D1E]/20 text-[#E87D1E]",
        };
        return <span className={`px-2 py-1 text-xs font-bold rounded ${styles[status]}`}>{status}</span>;
    };

    const ShipmentTracker: React.FC<{ shipment: Shipment }> = ({ shipment }) => (
        <div className="bg-slate-50 rounded-lg p-3">
             <div className="flex justify-between items-center text-sm">
                <span className="font-bold text-slate-800">{shipment.from}</span>
                <Icons.TruckIcon className="w-5 h-5 text-slate-400"/>
                <span className="font-bold text-slate-800">{shipment.to}</span>
             </div>
             <div className="relative h-1 bg-slate-200 rounded-full my-2">
                <div className="absolute top-0 left-0 h-1 bg-[#54B948] rounded-full" style={{width: '60%'}}></div>
             </div>
             <div className="text-xs text-slate-500 text-center">สถานะ: {shipment.status}</div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-800">แดชบอร์ดรวม</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    <Calendar />
                    <Card>
                        <h2 className="text-lg font-bold text-slate-800 mb-3">ข่าวสารแจ้งเตือน</h2>
                        <div className="space-y-3">
                        {mockData.mockAdminNews.map(news => (
                            <div key={news.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                                <span className={`text-xs font-bold ${news.category === 'ประกาศ' ? 'text-red-500' : 'text-blue-500'}`}>{news.category}</span>
                                <p className="font-semibold text-slate-700 text-sm">{news.title}</p>
                                <p className="text-xs text-slate-400">{news.date}</p>
                            </div>
                        ))}
                        </div>
                    </Card>
                </div>
                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h2 className="text-lg font-bold text-slate-800 mb-3">คิววันที่ {selectedDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}</h2>
                        {queuesForDay.length > 0 ? (
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {queuesForDay.map(q => (
                                    <div key={q.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${q.userType === UserRole.FACTORY ? 'bg-blue-200' : 'bg-green-200'}`}>
                                            {q.userType === UserRole.FACTORY ? 
                                                <Icons.BuildingOfficeIcon className="w-5 h-5 text-blue-700" /> : 
                                                <Icons.SproutIcon className="w-5 h-5 text-green-700" />
                                            }
                                        </div>
                                        <div className="flex-grow">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {q.userType === UserRole.FACTORY ? `มีนัดรับของใหม่ จาก ${q.farmerName}` : `มีนัดส่งของใหม่ จาก ${q.userName}`}
                                            </p>
                                            <p className="text-xs text-slate-500">ดูรายละเอียด</p>
                                        </div>
                                        <StatusTag status={q.status} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                             <p className="text-center text-slate-500 py-8">ไม่มีคิวสำหรับวันนี้</p>
                        )}
                    </Card>
                    <Card>
                        <h2 className="text-lg font-bold text-slate-800 mb-3">รายการการขนส่ง</h2>
                         <div className="space-y-4">
                            {mockData.farmerShipments.slice(0,2).map(shipment => (
                                <ShipmentTracker key={shipment.id} shipment={shipment} />
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;