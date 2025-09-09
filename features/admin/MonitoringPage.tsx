// features/admin/MonitoringPage.tsx
// คอมโพเนนต์สำหรับหน้าจัดการระบบติดตามและตรวจสอบ

import React, { useState, useMemo } from 'react';
import { mockMonitoringRequests, allAdminBookings, mockMonthlyQuotas } from '../../data/mockData';
import { MonitoringRequest, MonitoringRequestStatus, Booking, BookingStatus, UserRole, MonthlyQuota, FactoryQuota } from '../../types';
import * as Icons from '../../constants';
import BookingDetailsModal from '../farmer/BookingDetailsModal';

type MainTab = 'inspection' | 'calendar' | 'schedule';

// Helper function to parse 'dd/mm/yy' string to a Date object
const parseDate = (dateStr: string): Date => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return new Date(NaN);
    // Assuming year 'yy' is in the 21st century (Thai year - 543)
    const year = parseInt(parts[2], 10) + 2500 - 543;
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[0], 10);
    return new Date(year, month, day);
};

// === Badge Components ===
const MonitoringStatusBadge: React.FC<{ status: MonitoringRequestStatus }> = ({ status }) => {
    const config = {
        [MonitoringRequestStatus.COMPLETED]: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
        [MonitoringRequestStatus.IN_PROGRESS]: { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
        [MonitoringRequestStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    };
    const { bg, text, dot } = config[status];
    return (
        <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
            <span className={`w-2 h-2 rounded-full ${dot}`}></span>
            <span>{status}</span>
        </span>
    );
};

const BookingStatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
    const config = {
        [BookingStatus.COMPLETED]: { bg: 'bg-gray-200', text: 'text-gray-800' },
        [BookingStatus.CONFIRMED]: { bg: 'bg-blue-100', text: 'text-blue-800' },
        [BookingStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    };
    const { bg, text } = config[status];
    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${bg} ${text}`}>
            {status}
        </span>
    );
};


const MonitoringPage: React.FC = () => {
    const [activeMainTab, setActiveMainTab] = useState<MainTab>('inspection');
    const [activeCalendarTab, setActiveCalendarTab] = useState<UserRole>(UserRole.FACTORY);
    
    const [requests, setRequests] = useState<MonitoringRequest[]>(mockMonitoringRequests);
    const [bookings, setBookings] = useState<Booking[]>(allAdminBookings);
    const [quotas, setQuotas] = useState<MonthlyQuota[]>(mockMonthlyQuotas);
    
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6, 1)); // Set to July 2568
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2025, 6, 14));
    const [selectedBookingDetails, setSelectedBookingDetails] = useState<Booking | null>(null);

    const handleConfirmBooking = (bookingId: string) => {
        let confirmedBooking: Booking | null = null;
        const updatedBookings = bookings.map(b => {
            if (b.id === bookingId) {
                confirmedBooking = { ...b, status: BookingStatus.CONFIRMED };
                return confirmedBooking;
            }
            return b;
        });
        
        setBookings(updatedBookings);

        // Also update the details modal if it's showing the confirmed booking
        if (selectedBookingDetails?.id === bookingId && confirmedBooking) {
            setSelectedBookingDetails(confirmedBooking);
        }
    };
    
    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
            return newMonth;
        });
    };
    
    const handleQuotaChange = (type: 'factory' | 'seed' | 'fertilizer', id: string, delta: number) => {
        setQuotas(prevQuotas => prevQuotas.map(monthlyQuota => {
            const monthName = currentMonth.toLocaleString('th-TH', { month: 'long', year: 'numeric' });
            if (monthlyQuota.monthName !== monthName) {
                return monthlyQuota;
            }
            
            let updatedQuota = { ...monthlyQuota };
            if (type === 'factory') {
                updatedQuota.factoryQuotas = monthlyQuota.factoryQuotas.map(fq => {
                    if (fq.id === id) {
                        return { ...fq, total: Math.max(fq.used, fq.total + delta) };
                    }
                    return fq;
                });
            } else if (type === 'seed') {
                 updatedQuota.seedQuota = { ...monthlyQuota.seedQuota, total: Math.max(monthlyQuota.seedQuota.used, monthlyQuota.seedQuota.total + delta) };
            } else if (type === 'fertilizer') {
                updatedQuota.fertilizerQuota = { ...monthlyQuota.fertilizerQuota, total: Math.max(monthlyQuota.fertilizerQuota.used, monthlyQuota.fertilizerQuota.total + delta) };
            }

            return updatedQuota;
        }));
    };


    const bookingsByDate = useMemo(() => {
        return bookings.reduce((acc, booking) => {
            const dateKey = parseDate(booking.date).toDateString();
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(booking);
            return acc;
        }, {} as Record<string, Booking[]>);
    }, [bookings]);

    const renderCalendar = () => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - monthStart.getDay());
        
        const days = [];
        for (let i = 0; i < 42; i++) {
            days.push(new Date(startDate));
            startDate.setDate(startDate.getDate() + 1);
        }

        return (
             <div className="bg-[#FFFBEB] border-2 border-black rounded-xl shadow-md p-4">
                 <div className="flex items-center justify-between mb-4">
                     <button onClick={() => handleMonthChange('prev')} className="p-2 rounded-full hover:bg-amber-100"><Icons.ChevronLeftIcon className="w-6 h-6"/></button>
                     <h3 className="text-lg font-bold text-slate-800">{currentMonth.toLocaleString('th-TH', { month: 'long', year: 'numeric' })}</h3>
                     <button onClick={() => handleMonthChange('next')} className="p-2 rounded-full hover:bg-amber-100"><Icons.ChevronRightIcon className="w-6 h-6"/></button>
                 </div>
                 <div className="grid grid-cols-7 gap-1 text-center text-sm font-semibold text-slate-600">
                     {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map(d => <div key={d}>{d}</div>)}
                 </div>
                 <div className="grid grid-cols-7 gap-1 mt-2">
                     {days.map((day, index) => {
                         const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                         const isToday = day.toDateString() === new Date().toDateString();
                         const isSelected = day.toDateString() === selectedDate?.toDateString();
                         
                         const dayBookings = bookingsByDate[day.toDateString()];
                         const hasBookingForTab = dayBookings && (
                             activeCalendarTab === UserRole.FARMER
                                 ? dayBookings.length > 0
                                 : dayBookings.some(b => b.userType === UserRole.FACTORY)
                         );
                         
                         return (
                            <button 
                                key={index} 
                                onClick={() => setSelectedDate(day)}
                                className={`h-10 rounded-lg transition-colors relative ${!isCurrentMonth ? 'text-slate-400' : 'text-slate-800 hover:bg-amber-100'} ${isSelected ? 'bg-amber-300 ring-2 ring-amber-400' : ''} ${isToday ? 'font-bold' : ''}`}
                            >
                                {day.getDate()}
                                {hasBookingForTab && <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-green-500 rounded-full"></div>}
                            </button>
                         );
                     })}
                 </div>
             </div>
        );
    };

    const renderBookingListForDay = () => {
        if (!selectedDate) {
            return <div className="p-4 text-center text-slate-500">กรุณาเลือกวันในปฏิทิน</div>;
        }
        const allDayBookings = bookingsByDate[selectedDate.toDateString()] || [];
        const dayBookings = activeCalendarTab === UserRole.FARMER
            ? allDayBookings
            : allDayBookings.filter(b => b.userType === UserRole.FACTORY);
        
        return (
            <div className="bg-[#FFFBEB] border-2 border-black rounded-xl shadow-md p-4 h-full">
                <h3 className="font-bold text-slate-800 mb-2">คิววันที่ {selectedDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}</h3>
                {dayBookings.length > 0 ? (
                    <div className="space-y-3 overflow-y-auto max-h-[400px]">
                        {dayBookings.map(b => (
                            <div key={b.id} className="p-3 bg-white rounded-lg border border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{b.userName}</p>
                                        <p className="text-sm text-slate-600">{b.description}</p>
                                    </div>
                                    <BookingStatusBadge status={b.status}/>
                                </div>
                                <div className="flex items-center justify-end gap-3 mt-2 pt-2 border-t border-gray-100">
                                    <button onClick={() => setSelectedBookingDetails(b)} className="text-sm font-semibold text-blue-600 hover:text-blue-800">
                                        ดูรายละเอียด
                                    </button>
                                    {b.status === BookingStatus.PENDING && (
                                         <button onClick={() => handleConfirmBooking(b.id)} className="text-sm bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-4 rounded-md transition-colors">ยืนยันคิว</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 text-center text-slate-500">ไม่มีคิวในวันนี้</div>
                )}
            </div>
        );
    };
    
    const renderQuotaManagement = () => {
        const monthName = currentMonth.toLocaleString('th-TH', { month: 'long', year: 'numeric' });
        const currentQuota = quotas.find(q => q.monthName === monthName);

        const QuotaControl: React.FC<{onDecrement: () => void, onIncrement: () => void, value: number}> = ({ onDecrement, onIncrement, value}) => (
            <div className="flex items-center space-x-2">
                <button onClick={onDecrement} className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-md border border-black">-</button>
                <span className="font-bold text-slate-900 w-8 text-center">{value}</span>
                <button onClick={onIncrement} className="w-7 h-7 bg-gray-200 hover:bg-gray-300 rounded-md border border-black">+</button>
            </div>
        );

        return (
            <div className="space-y-6">
                 <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg border-2 border-black">
                     <button onClick={() => handleMonthChange('prev')} className="p-2 rounded-full hover:bg-amber-100"><Icons.ChevronLeftIcon className="w-6 h-6"/></button>
                     <h2 className="text-xl font-bold text-slate-900">จัดการโควต้าเดือน: {monthName}</h2>
                     <button onClick={() => handleMonthChange('next')} className="p-2 rounded-full hover:bg-amber-100"><Icons.ChevronRightIcon className="w-6 h-6"/></button>
                 </div>

                {!currentQuota ? (
                    <div className="bg-[#FFFBEB] border-2 border-black rounded-xl shadow-md p-6 text-center text-slate-500">
                        ไม่มีข้อมูลโควต้าสำหรับเดือนนี้
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Factory Quotas */}
                        <div className="bg-[#FFFBEB] border-2 border-black rounded-xl shadow-md p-6 space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 border-b-2 border-amber-300 pb-2">โควต้าการรับซื้อ (โรงงาน)</h3>
                            {currentQuota.factoryQuotas.map(fq => (
                                <div key={fq.id} className="flex justify-between items-center bg-white p-3 rounded-md border">
                                    <div>
                                        <p className="font-semibold text-slate-800">{fq.name}</p>
                                        <p className="text-sm text-slate-600">ใช้ไปแล้ว: <span className="font-bold">{fq.used} / {fq.total}</span> คิว</p>
                                    </div>
                                    <QuotaControl 
                                        value={fq.total}
                                        onDecrement={() => handleQuotaChange('factory', fq.id, -1)}
                                        onIncrement={() => handleQuotaChange('factory', fq.id, 1)}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Material Quotas */}
                         <div className="bg-[#FFFBEB] border-2 border-black rounded-xl shadow-md p-6 space-y-4">
                            <h3 className="text-lg font-bold text-slate-900 border-b-2 border-amber-300 pb-2">โควต้าวัสดุการเกษตร</h3>
                             <div className="flex justify-between items-center bg-white p-3 rounded-md border">
                                <div>
                                    <p className="font-semibold text-slate-800">เมล็ดพันธุ์</p>
                                    <p className="text-sm text-slate-600">ใช้ไปแล้ว: <span className="font-bold">{currentQuota.seedQuota.used} / {currentQuota.seedQuota.total}</span> คิว</p>
                                </div>
                                 <QuotaControl 
                                    value={currentQuota.seedQuota.total}
                                    onDecrement={() => handleQuotaChange('seed', 'seed', -1)}
                                    onIncrement={() => handleQuotaChange('seed', 'seed', 1)}
                                />
                            </div>
                             <div className="flex justify-between items-center bg-white p-3 rounded-md border">
                                <div>
                                    <p className="font-semibold text-slate-800">ปุ๋ย</p>
                                    <p className="text-sm text-slate-600">ใช้ไปแล้ว: <span className="font-bold">{currentQuota.fertilizerQuota.used} / {currentQuota.fertilizerQuota.total}</span> คิว</p>
                                </div>
                                <QuotaControl 
                                    value={currentQuota.fertilizerQuota.total}
                                    onDecrement={() => handleQuotaChange('fertilizer', 'fertilizer', -1)}
                                    onIncrement={() => handleQuotaChange('fertilizer', 'fertilizer', 1)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    
    const TabButton: React.FC<{ tabId: MainTab; children: React.ReactNode }> = ({ tabId, children }) => (
        <button
            onClick={() => setActiveMainTab(tabId)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                activeMainTab === tabId ? 'bg-amber-300 text-black shadow' : 'bg-amber-100 text-slate-800 hover:bg-amber-200'
            }`}
        >
            {children}
        </button>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">ระบบติดตามและจัดการคิว</h1>
             <div className="flex space-x-2">
                <TabButton tabId="inspection">คำขอตรวจสอบ</TabButton>
                <TabButton tabId="calendar">ปฏิทินคิว</TabButton>
                <TabButton tabId="schedule">จัดการตารางคิวและโควต้า</TabButton>
            </div>
            
            {activeMainTab === 'inspection' && (
                <div className="bg-[#FFFBEB] border-2 border-black rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-6">รายการคำขอตรวจสอบ</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-amber-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">ผู้ร้องขอ</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">ประเภทคำขอ</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">วันที่ร้องขอ</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">ผู้รับผิดชอบ</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-600 uppercase tracking-wider">สถานะ</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">ดำเนินการ</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#FFFBEB] divide-y divide-gray-200">
                            {requests.map((req) => (
                                <tr key={req.id} className="hover:bg-amber-100/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{req.requesterName}</td>
                                    <td className="px-6 py-4 text-sm text-slate-700">{req.requestType}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{req.requestDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{req.assignedTo || '-'}</td>
                                    <td className="px-6 py-4 text-center"><MonitoringStatusBadge status={req.status} /></td>
                                    <td className="px-6 py-4 text-right">
                                         <button className="text-sm text-blue-600 hover:text-blue-800 font-semibold">
                                            {req.status === MonitoringRequestStatus.PENDING ? 'มอบหมายงาน' : 'ดูรายละเอียด'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </div>
                </div>
            )}
            
            {activeMainTab === 'calendar' && (
                <div className="space-y-4">
                     <div className="flex space-x-2 bg-amber-200/50 p-1 rounded-lg border border-black max-w-sm">
                        <button onClick={() => setActiveCalendarTab(UserRole.FARMER)} className={`w-1/2 py-2 rounded-md font-semibold ${activeCalendarTab === UserRole.FARMER ? 'bg-amber-300 shadow' : ''}`}>เกษตรกร</button>
                        <button onClick={() => setActiveCalendarTab(UserRole.FACTORY)} className={`w-1/2 py-2 rounded-md font-semibold ${activeCalendarTab === UserRole.FACTORY ? 'bg-amber-300 shadow' : ''}`}>โรงงาน</button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="lg:col-span-2">{renderCalendar()}</div>
                        <div className="lg:col-span-1">{renderBookingListForDay()}</div>
                    </div>
                </div>
            )}

            {activeMainTab === 'schedule' && renderQuotaManagement()}

            <BookingDetailsModal
                booking={selectedBookingDetails}
                onClose={() => setSelectedBookingDetails(null)}
            />
        </div>
    );
};

export default MonitoringPage;