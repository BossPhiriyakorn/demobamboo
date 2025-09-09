// components/NotificationSidebar.tsx
// คอมโพเนนต์สำหรับหน้าต่างแจ้งเตือน (Notification) ในรูปแบบ Modal ที่แสดงผลตรงกลาง

import React from 'react';
import { SimpleNotification } from '../types';
import { XMarkIcon } from '../constants';

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: SimpleNotification[];
}

const NotificationSidebar: React.FC<NotificationSidebarProps> = ({ isOpen, onClose, notifications }) => {
    // แยกประเภทการแจ้งเตือนเป็น "ล่าสุด" และ "ก่อนหน้านี้"
    const latestNotifications = notifications.filter(n => n.isLatest);
    const previousNotifications = notifications.filter(n => !n.isLatest);

    // ไม่ต้อง render อะไรเลยถ้า Modal ไม่ได้เปิด
    if (!isOpen) {
        return null;
    }

    return (
        // Overlay และ Container สำหรับจัดให้อยู่กึ่งกลาง
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 transition-opacity duration-300"
            onClick={onClose} // ปิดเมื่อคลิกที่พื้นหลัง
            role="dialog"
            aria-modal="true"
        >
            {/* กล่อง Modal */}
            <div
                className="bg-white text-slate-800 w-full max-w-sm rounded-2xl shadow-2xl flex flex-col max-h-[85vh] transform transition-all duration-300"
                onClick={e => e.stopPropagation()} // ป้องกันการปิดเมื่อคลิกที่ตัว Modal
            >
                {/* ส่วนหัวของ Modal */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <h2 className="text-xl font-bold">การแจ้งเตือน</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* เนื้อหาการแจ้งเตือน (สามารถเลื่อนได้) */}
                <div className="flex-grow overflow-y-auto p-4 space-y-6 bg-gray-50/50">
                    {/* ส่วน "ล่าสุด" */}
                    {latestNotifications.length > 0 && (
                        <section>
                            <h3 className="font-bold text-lg mb-2 text-slate-600 px-1">ล่าสุด</h3>
                            <div className="space-y-3">
                                {latestNotifications.map(n => (
                                    <div key={n.id} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-green-500">
                                        <p className="text-sm text-slate-700">{n.message}</p>
                                        <p className="text-xs text-slate-500 text-right mt-1">{n.timestamp}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ส่วน "ก่อนหน้านี้" */}
                    {previousNotifications.length > 0 && (
                        <section>
                            <h3 className="font-bold text-lg mb-2 text-slate-600 px-1">ก่อนหน้านี้</h3>
                            <div className="space-y-3">
                                {previousNotifications.map(n => (
                                    <div key={n.id} className="bg-white p-3 rounded-lg shadow-sm border-l-4 border-gray-400">
                                        <p className="text-sm text-slate-700">{n.message}</p>
                                        <p className="text-xs text-slate-500 text-right mt-1">{n.timestamp}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* กรณีไม่มีการแจ้งเตือน */}
                    {notifications.length === 0 && (
                        <div className="text-center py-10 text-slate-500">ไม่มีการแจ้งเตือน</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationSidebar;