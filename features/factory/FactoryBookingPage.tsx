// features/factory/FactoryBookingPage.tsx
import React, { useState, useMemo } from 'react';
import { Booking, BookingStatus, UserRole } from '../../types';
import * as Icons from '../../constants';
import * as mockData from '../../data/mockData';
import FactoryBookingModal from './FactoryBookingModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import Card from '../../components/Card';


interface FactoryBookingPageProps {
    schedule: Booking[];
    onUpdateSchedule: (updatedSchedule: Booking[]) => void;
}

// Helper function to parse 'dd/mm/yyyy' string to a Date object
const parseDate = (dateStr: string): Date => {
    const parts = dateStr.split('/');
    if (parts.length !== 4) return new Date(NaN);
    return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
};

const parseThaiDate = (dateStr: string): Date => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return new Date(NaN);
    const year = parseInt(parts[2], 10) - 543; // Convert Buddhist year to AD
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[0], 10);
    return new Date(year, month, day);
};


const FactoryBookingPage: React.FC<FactoryBookingPageProps> = ({ schedule, onUpdateSchedule }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6, 1)); // July 2025
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 18));

    const [isModalOpen, setModalOpen] = useState(false);
    const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
    
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

    const handleMonthChange = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newMonth = new Date(prev);
            newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
            return newMonth;
        });
    };
    
    const handleSaveBooking = (bookingData: Partial<Booking>) => {
        let updatedSchedule: Booking[];
        if (editingBooking) {
            updatedSchedule = schedule.map(b => (b.id === editingBooking.id ? { ...b, ...bookingData } : b) as Booking);
        } else {
            const newBooking: Booking = {
                id: `fs-${Date.now()}`,
                status: BookingStatus.PENDING,
                userType: UserRole.FACTORY,
                userName: `${mockData.factoryProfile.firstName} ${mockData.factoryProfile.lastName}`,
                ...bookingData,
            } as Booking;
            updatedSchedule = [newBooking, ...schedule];
        }
        onUpdateSchedule(updatedSchedule);
        setModalOpen(false);
    };
    
    const handleConfirmStatus = (bookingId: string) => {
        const updatedSchedule = schedule.map(b =>
            b.id === bookingId ? { ...b, status: BookingStatus.CONFIRMED } : b
        );
        onUpdateSchedule(updatedSchedule);
    };
    
    const handleDeleteClick = (booking: Booking) => {
        setBookingToDelete(booking);
        setConfirmOpen(true);
    };

    const confirmDelete = () => {
        if (!bookingToDelete) return;
        onUpdateSchedule(schedule.filter(b => b.id !== bookingToDelete.id));
        setBookingToDelete(null);
        setConfirmOpen(false);
    };

    const handleEditClick = (booking: Booking) => {
        setEditingBooking(booking);
        setModalOpen(true);
    };

    const bookingsByDate = useMemo(() => {
        return schedule.reduce((acc, booking) => {
            // Use the original string date as key
            const dateKey = parseThaiDate(booking.date).toDateString();
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(booking);
            return acc;
        }, {} as Record<string, Booking[]>);
    }, [schedule]);
    
    const bookingsForSelectedDay = useMemo(() => {
        return bookingsByDate[selectedDate.toDateString()] || [];
    }, [selectedDate, bookingsByDate]);
    
     const renderCalendar = () => {
        const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
        const firstDayOfWeek = monthStart.getDay();
        const calendarDays = Array(firstDayOfWeek).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
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

    const StatusLabel: React.FC<{ status: BookingStatus }> = ({ status }) => {
        const styles = {
            [BookingStatus.PENDING]: "text-[#E87D1E]",
            [BookingStatus.CONFIRMED]: "text-[#009DD4]",
            [BookingStatus.COMPLETED]: "text-[#54B948]",
        };
        return <span className={`text-xs font-bold ${styles[status]}`}>{status}</span>;
    };
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">จัดการตารางนัดหมาย</h1>
                    <p className="text-slate-600">กำหนดวันรับซื้อและจัดการคิวที่เกษตรกรจองเข้ามา</p>
                </div>
                 <button onClick={() => { setEditingBooking(null); setModalOpen(true); }} className="bg-[#54B948] hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex items-center space-x-2 shadow-sm">
                    <Icons.PlusIcon className="h-5 w-5"/>
                    <span>เพิ่มวันรับซื้อ</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {renderCalendar()}
                    <Card>
                        <h3 className="text-lg font-bold text-slate-900 mb-3">โควต้ารายวันที่กำหนดแล้ว</h3>
                        <div className="space-y-2">
                            {mockData.mockDailyQuotas.map(item => (
                                <div key={item.date} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border">
                                    <span className="font-semibold text-slate-700">{item.date}</span>
                                    <span className="font-bold text-slate-800">{item.quota}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-3 space-y-4">
                    {bookingsForSelectedDay.length > 0 ? bookingsForSelectedDay.map(booking => (
                        <Card key={booking.id} className="p-4">
                            <div className="flex justify-between items-start mb-3">
                                <h4 className="font-bold text-lg text-slate-800">{booking.farmerName}</h4>
                                <StatusLabel status={booking.status} />
                            </div>
                             <div className="space-y-1 text-sm text-slate-600 border-t border-slate-100 pt-3">
                                <p><strong>วันที่:</strong> {booking.date}</p>
                                <p><strong>ที่อยู่:</strong> {booking.pickupLocation}</p>
                                <p><strong>ปริมาณ:</strong> {booking.estimatedQuantity}</p>
                             </div>
                            <div className="flex justify-end items-center space-x-3 mt-4 text-sm font-semibold">
                                {booking.status === BookingStatus.PENDING && (
                                    <button onClick={() => handleConfirmStatus(booking.id)} className="bg-[#54B948] hover:bg-green-600 text-white py-1 px-3 rounded-md">ยืนยันคิว</button>
                                )}
                                <button className="text-slate-500 hover:text-black">ดูรายละเอียด</button>
                                <button onClick={() => handleEditClick(booking)} className="text-slate-500 hover:text-black">แก้ไข</button>
                                <button onClick={() => handleDeleteClick(booking)} className="text-red-500 hover:text-red-700">ลบ</button>
                            </div>
                        </Card>
                    )) : (
                        <div className="text-center py-16 bg-white border-2 border-dashed border-gray-300 rounded-xl text-slate-500">
                            ไม่มีคิวนัดหมายในวันที่เลือก
                        </div>
                    )}
                </div>
            </div>

            <FactoryBookingModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveBooking}
                booking={editingBooking}
            />

            {isConfirmOpen && bookingToDelete && (
                <ConfirmationModal 
                    title="ยืนยันการลบ"
                    message={`คุณแน่ใจหรือไม่ว่าต้องการลบคิวของ ${bookingToDelete.farmerName}?`}
                    onConfirm={confirmDelete}
                    onCancel={() => setConfirmOpen(false)}
                />
            )}
        </div>
    );
};

export default FactoryBookingPage;
