// features/factory/PickupCard.tsx
import React from 'react';
import { Booking, BookingStatus } from '../../types';
import * as Icons from '../../constants';

interface PickupCardProps {
    booking: Booking;
    onEdit: (booking: Booking) => void;
    onUpdateStatus: (bookingId: string, newStatus: BookingStatus) => void;
}

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
    const config = {
        [BookingStatus.PENDING]: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'รอดำเนินการ' },
        [BookingStatus.CONFIRMED]: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'ยืนยันแล้ว' },
        [BookingStatus.COMPLETED]: { bg: 'bg-green-100', text: 'text-green-800', label: 'รับแล้ว' },
    };
    const { bg, text, label } = config[status] || config[BookingStatus.PENDING];
    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
            {label}
        </span>
    );
};

const PickupCard: React.FC<PickupCardProps> = ({ booking, onEdit, onUpdateStatus }) => {
    const nextStatus = booking.status === BookingStatus.PENDING ? BookingStatus.CONFIRMED : BookingStatus.COMPLETED;
    const nextStatusLabel = booking.status === BookingStatus.PENDING ? 'ยืนยันคิว' : 'รับสินค้าแล้ว';

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 flex flex-col space-y-3">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-slate-900">{booking.farmerName}</h3>
                <StatusBadge status={booking.status} />
            </div>

            <div className="text-sm text-slate-700 space-y-1">
                <p><strong className="font-semibold text-slate-800">ที่อยู่:</strong> {booking.pickupLocation}</p>
                <p><strong className="font-semibold text-slate-800">ปริมาณ:</strong> {booking.estimatedQuantity}</p>
                <p><strong className="font-semibold text-slate-800">รายละเอียด:</strong> {booking.description}</p>
            </div>

            <div className="pt-2 flex justify-between items-center">
                <button onClick={() => onEdit(booking)} className="flex items-center space-x-1.5 text-sm font-semibold text-slate-600 hover:text-black">
                    <Icons.PencilIcon className="w-4 h-4" />
                    <span>แก้ไข</span>
                </button>
                {booking.status !== BookingStatus.COMPLETED && (
                    <button 
                        onClick={() => onUpdateStatus(booking.id, nextStatus)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1.5 px-4 rounded-lg text-sm"
                    >
                        {nextStatusLabel}
                    </button>
                )}
            </div>
        </div>
    );
};

export default PickupCard;