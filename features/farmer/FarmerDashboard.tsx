// features/farmer/FarmerDashboard.tsx
// คอมโพเนนต์สำหรับหน้าแดชบอร์ดของเกษตรกร (โฉมใหม่)

import React, { useState } from 'react';
import { KnowledgeArticle, KnowledgeArticleStatus } from '../../types';
import * as Icons from '../../constants';
import * as mockData from '../../data/mockData';

// =================================================================
// Sub-components for the new Dashboard
// =================================================================

interface FarmerDashboardProps {
    onMenuClick: () => void;
    onNotificationClick: () => void;
}

const DashboardHeader: React.FC<{ onMenuClick: () => void; onNotificationClick: () => void; }> = ({ onMenuClick, onNotificationClick }) => {
    return (
        <div 
            className="relative h-48 bg-cover bg-center rounded-b-3xl text-white flex items-start justify-center pt-12"
            style={{ backgroundImage: "url('/images/banners/ดีไซน์ที่ยังไม่ได้ตั้งชื่อ (1) 3.png')" }}
        >
            {/* Custom gradient overlay with #005596 */}
            <div className="absolute inset-0 rounded-b-3xl" style={{ background: 'linear-gradient(to bottom, rgba(0, 85, 150, 0.8), rgba(0, 85, 150, 0.8), rgba(0, 85, 150, 0.8))' }}></div>
            
            <div className="relative z-10 flex items-center justify-between w-full px-4">
                <button onClick={onMenuClick} className="p-2">
                    <Icons.Bars3Icon className="w-7 h-7" />
                </button>
                <div className="text-center">
                    <p className="text-xs text-white/80">Your location</p>
                    <p className="font-bold flex items-center justify-center gap-1">
                        <Icons.MapPinIcon className="w-4 h-4 text-orange-400" />
                        Gampaha, Sri Lanka
                    </p>
                </div>
                <div className="relative">
                    <button onClick={onNotificationClick} className="bg-white/95 p-3 rounded-full shadow-md">
                        <Icons.BellIcon className="w-6 h-6 text-slate-700" />
                    </button>
                    <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
                </div>
            </div>
        </div>
    );
};


const WeatherCard = () => (
    <div className="bg-white rounded-2xl shadow-lg p-4 mx-4 -mt-12 relative z-20 flex justify-between items-center">
        <div>
            <p className="text-5xl font-bold text-slate-800">23°C</p>
            <p className="text-slate-600 font-semibold">Gampaha ,Sri Lanka</p>
        </div>
        <Icons.CloudLightningIcon className="w-20 h-20 text-yellow-400" />
    </div>
);

const CallToAction = () => (
    <div className="mx-4 mt-6 rounded-2xl p-6 relative text-white overflow-hidden h-48 flex items-center shadow-lg" style={{ background: 'linear-gradient(to right, #4a5568, #718096)' }}>
        <div className="relative z-10 w-full flex justify-end">
            <div className="w-full md:w-7/12 text-right">
                 <h2 className="font-bold text-lg md:text-xl leading-tight md:leading-snug mb-4">
                    เริ่มต้นเข้าร่วมโครงการ<br/>
                    ปลูกไผ่ได้ง่ายๆเพียง<br/>
                    ลงทะเบียนผ่าน<br/>
                    แบบฟอร์มออนไลน์
                 </h2>
                 <button className="bg-[#8CC63F] hover:bg-green-600 text-white font-bold text-base py-2 px-5 md:py-3 md:px-6 rounded-xl shadow-md transition-colors">
                    ลงข้อมูลและส่งเอกสาร
                </button>
            </div>
        </div>
    </div>
);


const Section: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
    <div className="mt-6 px-4">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <a href="#" className="text-sm font-semibold text-cyan-500 hover:text-cyan-700">ดูเพิ่มเติม {'>>'}</a>
        </div>
        {children}
    </div>
);

// Redesigned NewsCard for a grid view
const NewsCard: React.FC<{ article: KnowledgeArticle }> = ({ article }) => {
    const hasImage = article.imageUrl && article.imageUrl.length > 0;

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
            {hasImage && (
                <img src={article.imageUrl} alt={article.title} className="w-full h-32 object-cover" />
            )}
            <div className="p-4 flex flex-col flex-grow">
                <h4 className="font-bold text-slate-800 leading-tight mb-1 line-clamp-2 min-h-[2.5rem]">{article.title}</h4>
                <p className="text-sm text-slate-600 mb-2 flex-grow line-clamp-2">{article.content}</p>
                <div className="flex justify-between items-center mt-auto pt-2 text-xs text-slate-500">
                    <span>{article.postDate}</span>
                    <a href="#" className="font-semibold text-cyan-500 hover:text-cyan-700">อ่านเพิ่มเติม {'>>'}</a>
                </div>
            </div>
        </div>
    );
};


// =================================================================
// Main Dashboard Component
// =================================================================

const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ onMenuClick, onNotificationClick }) => {
    const [activeFilter, setActiveFilter] = useState('ทั้งหมด');
    
    // สร้างรายการฟิลเตอร์จากข้อมูลบทความโดยอัตโนมัติ
    const categories = [...new Set(mockData.knowledgeArticles.map(a => a.category))];
    const filters = ['ทั้งหมด', ...categories];

    // กรองบทความตามฟิลเตอร์ที่เลือก
    const filteredArticles = mockData.knowledgeArticles
        .filter(a => a.status === KnowledgeArticleStatus.PUBLISHED)
        .filter(article => activeFilter === 'ทั้งหมด' || article.category === activeFilter);

    return (
        <div 
            className="bg-[#F0F5F9] min-h-screen"
            style={{
                backgroundImage: "url('/Group.png')",
                backgroundPosition: 'bottom right',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
            }}
        >
            <DashboardHeader onMenuClick={onMenuClick} onNotificationClick={onNotificationClick} />

            {/* Main content container */}
            <div className="pb-4">
                <WeatherCard />
                <CallToAction />

                <Section title="ปฏิทินแนวทางปฏิบัติ">
                    <div className="bg-cyan-100 rounded-xl p-10 text-center text-slate-500 font-semibold">
                        ไม่มีข้อมูล
                    </div>
                </Section>

                <Section title="ตรวจสอบสถานะ">
                    <div className="bg-white rounded-xl p-10 text-center text-slate-500 font-semibold border border-slate-200">
                        ไม่มีข้อมูล
                    </div>
                </Section>

                <Section title="ข่าวสาร">
                    <div className="flex space-x-2 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
                        {filters.map(filter => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                                    activeFilter === filter
                                        ? 'bg-cyan-400 text-white shadow border-2 border-black'
                                        : 'bg-white text-cyan-500 border border-cyan-400 hover:bg-cyan-50'
                                }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                     {/* Wrapper for scrollable area */}
                    <div className="relative mt-4">
                        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 no-scrollbar">
                            {filteredArticles.map((article) => (
                                <NewsCard key={article.id} article={article} />
                            ))}
                        </div>
                    </div>
                </Section>
            </div>
        </div>
    );
};

export default FarmerDashboard;