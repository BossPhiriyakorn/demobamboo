// components/KnowledgeBasePage.tsx
// คอมโพเนนต์สำหรับหน้าคลังความรู้
// จัดการการแสดงผลทั้งในรูปแบบรายการบทความ (list view) และหน้ารายละเอียดบทความ (detail view)

import React, { useState, useEffect } from 'react';
import { KnowledgeArticle } from '../types';
import Card from './Card';

// Props ที่คอมโพเนนตต้องการ
interface KnowledgeBasePageProps {
    articles: KnowledgeArticle[];                // รายการบทความทั้งหมด
    initialSelectedArticleId?: string | null;   // ID ของบทความที่ถูกเลือกมาตอนแรก (ถ้ามี)
    onClearSelection?: () => void;              // ฟังก์ชันที่จะทำงานเมื่อเคลียร์การเลือกบทความ
}

const KnowledgeBasePage: React.FC<KnowledgeBasePageProps> = ({ articles, initialSelectedArticleId, onClearSelection }) => {
    
    // ฟังก์ชันสำหรับค้นหาบทความจาก ID
    const findArticleById = (id: string | null): KnowledgeArticle | null => {
        if (!id) return null;
        return articles.find(a => a.id === id) || null;
    };

    // State สำหรับเก็บข้อมูลบทความที่กำลังถูกเลือกดู
    const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(() => findArticleById(initialSelectedArticleId || null));
    
    // useEffect เพื่ออัปเดต selectedArticle เมื่อ initialSelectedArticleId เปลี่ยนแปลง
    useEffect(() => {
        setSelectedArticle(findArticleById(initialSelectedArticleId || null));
    }, [initialSelectedArticleId, articles]);

    // ฟังก์ชันสำหรับกลับไปหน้ารายการบทความ
    const handleGoBack = () => {
        setSelectedArticle(null);
        if (onClearSelection) {
            onClearSelection();
        }
    };

    // === ส่วนแสดงผลหน้ารายละเอียดบทความ ===
    if (selectedArticle) {
        return (
            <div className="max-w-4xl mx-auto space-y-6">
                <button onClick={handleGoBack} className="font-bold text-slate-800 hover:text-black">
                    &larr; กลับไปที่คลังความรู้
                </button>
                <Card>
                    <img src={selectedArticle.imageUrl} alt={selectedArticle.title} className="w-full h-80 object-cover rounded-lg mb-6" />
                    <h1 className="text-4xl font-bold mb-2 text-center text-slate-900">{selectedArticle.title}</h1>
                    <p className="text-center text-slate-500 mb-6 text-sm">เผยแพร่เมื่อ: {selectedArticle.postDate}</p>
                    {/* .repeat(10) ใช้เพื่อจำลองเนื้อหาที่ยาวขึ้น */}
                    <p className="text-lg leading-relaxed text-slate-900">{selectedArticle.content.repeat(10)}</p>
                </Card>
            </div>
        )
    }

    // === ส่วนแสดงผลหน้ารายการบทความ ===
    return (
        <div className="space-y-6">
             <h1 className="text-3xl font-bold text-slate-900">ศูนย์การเรียนรู้</h1>
             <div className="grid grid-cols-2 gap-4 sm:gap-6">
                {articles.map((article) => (
                    <div key={article.id} className="bg-[#F7F6E8] rounded-2xl p-4 border-2 border-black flex flex-col transition-transform duration-300 hover:-translate-y-1">
                        <img src={article.imageUrl} alt={article.title} className="w-full h-32 sm:h-40 object-cover rounded-lg mb-4"/>
                        <div className="flex flex-col flex-grow">
                            <h3 className="font-bold text-base md:text-lg text-slate-800 flex-grow mb-4">{article.title}</h3>
                            <button
                                onClick={() => setSelectedArticle(article)}
                                className="w-full bg-[#FEEA7E] hover:bg-amber-400 text-black font-bold py-2 text-sm md:text-base rounded-lg border-2 border-black mt-auto"
                            >
                                อ่านเพิ่มเติม
                            </button>
                        </div>
                    </div>
                ))}
             </div>
        </div>
    );
};

export default KnowledgeBasePage;