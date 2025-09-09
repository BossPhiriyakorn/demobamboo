// components/PolicyModal.tsx
// คอมโพเนนต์สำหรับหน้าต่างแสดงนโยบาย/ข้อตกลง ที่บังคับให้ผู้ใช้อ่านจนจบ

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '../constants';

// Props
interface PolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAccept: () => void;
    title: string;
    content: string;
}

const PolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose, onAccept, title, content }) => {
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const hasContent = content && content.trim().length > 0;

    // ฟังก์ชันตรวจสอบการเลื่อน
    const handleScroll = () => {
        if (!hasContent) return;
        const contentElement = contentRef.current;
        if (contentElement) {
            const { scrollTop, scrollHeight, clientHeight } = contentElement;
            // เพิ่ม buffer เล็กน้อย (5px) เพื่อจัดการความคลาดเคลื่อนของค่าทศนิยม
            if (scrollHeight - scrollTop <= clientHeight + 5) {
                setIsScrolledToBottom(true);
            } else {
                setIsScrolledToBottom(false);
            }
        }
    };
    
    // รีเซ็ตสถานะการเลื่อนเมื่อ Modal เปิดขึ้นมาใหม่
    useEffect(() => {
        if (isOpen) {
            // If there's no content, user can accept immediately.
            if (!hasContent) {
                setIsScrolledToBottom(true);
                return;
            }

            setIsScrolledToBottom(false);
            // ใช้ setTimeout เพื่อรอให้ DOM render เสร็จสมบูรณ์ก่อนตรวจสอบความสูง
            // ซึ่งจำเป็นสำหรับกรณีที่เนื้อหาสั้นกว่าความสูงของกล่องตั้งแต่แรก
            const timer = setTimeout(() => {
                const contentElement = contentRef.current;
                if (contentElement && contentElement.scrollHeight <= contentElement.clientHeight) {
                    setIsScrolledToBottom(true);
                }
            }, 100); 

            return () => clearTimeout(timer);
        }
    }, [isOpen, title, hasContent]); // ทำงานใหม่เมื่อ Modal เปิดหรือเมื่อ title (เนื้อหา) เปลี่ยน


    if (!isOpen) return null;

    const handleAcceptClick = () => {
        onAccept();
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-sky-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1587899767727-7a5491560f70?q=80&w=1974&auto=format&fit=crop')" }}
        >
             <div className="relative bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[85vh]">
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center flex-shrink-0">{title}</h2>
                
                {/* กล่องเนื้อหาที่สามารถเลื่อนได้ */}
                <div 
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="prose prose-sm max-w-none overflow-y-auto pr-4 mb-6 flex-grow text-slate-800 prose-headings:text-slate-900 prose-strong:text-slate-900 custom-scrollbar"
                    style={{
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#CAE9C6 #EEF8ED'
                    }}
                >
                    {hasContent ? (
                         <div className="whitespace-pre-wrap">{content}</div>
                    ) : (
                        <p className="text-center text-slate-500 italic">ยังไม่มีเนื้อหาในขณะนี้</p>
                    )}
                </div>
                
                {/* ส่วนท้าย: ปุ่มและตัวบ่งชี้การเลื่อน */}
                <div className="flex flex-col items-center gap-4 flex-shrink-0">
                    {/* แสดงเมื่อยังเลื่อนไม่สุด */}
                    {hasContent && !isScrolledToBottom && (
                        <div className="flex flex-col items-center text-gray-500 animate-bounce">
                             <ChevronDownIcon className="w-6 h-6"/>
                             <span className="text-xs font-semibold">เลื่อนไปล่างสุด</span>
                        </div>
                    )}
                    <button 
                        onClick={handleAcceptClick}
                        disabled={!isScrolledToBottom}
                        className="w-full bg-gray-200 text-gray-500 font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:cursor-not-allowed"
                        style={{
                            backgroundColor: isScrolledToBottom ? '#53B847' : '#E5E7EB',
                            color: isScrolledToBottom ? '#FFFFFF' : '#6B7280'
                        }}
                        onMouseEnter={(e) => {
                            if (isScrolledToBottom) {
                                e.currentTarget.style.backgroundColor = '#4A9F3F';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (isScrolledToBottom) {
                                e.currentTarget.style.backgroundColor = '#53B847';
                            }
                        }}
                    >
                        ยอมรับ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PolicyModal;