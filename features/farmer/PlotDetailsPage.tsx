// features/farmer/PlotDetailsPage.tsx

import React from 'react';
import { Page, PlotDetails } from '../../types';
import Card from '../../components/Card';
import * as Icons from '../../constants';

// A simple placeholder map SVG component to match the design image
const PlaceholderMap = () => (
    <svg viewBox="0 0 400 200" className="w-full h-full object-cover bg-gray-200 rounded-lg">
        {/* Roads */}
        <path d="M 50 0 V 200" stroke="#FCD34D" strokeWidth="12" fill="none" />
        <path d="M 0 100 H 400" stroke="#FCD34D" strokeWidth="10" fill="none" />
        <path d="M 150 0 V 200" stroke="#FEF3C7" strokeWidth="4" fill="none" />
        <path d="M 250 50 H 400" stroke="#FEF3C7" strokeWidth="4" fill="none" />
        <path d="M 250 150 H 400" stroke="#FEF3C7" strokeWidth="4" fill="none" />
        <path d="M 320 50 V 150" stroke="#FEF3C7" strokeWidth="4" fill="none" />
        
        {/* Areas */}
        <rect x="62" y="10" width="76" height="80" fill="#A7F3D0" />
        <rect x="62" y="110" width="76" height="80" fill="#BAE6FD" />
        <rect x="162" y="10" width="78" height="180" fill="#FECACA" />
        
        {/* Points */}
        <circle cx="100" cy="70" r="5" fill="#3B82F6" stroke="white" strokeWidth="2" />
        <circle cx="300" cy="80" r="5" fill="#3B82F6" stroke="white" strokeWidth="2" />
    </svg>
);

interface PlotDetailsPageProps {
    details: PlotDetails;
    setActivePage: (page: Page) => void;
}

const PlotDetailsPage: React.FC<PlotDetailsPageProps> = ({ details, setActivePage }) => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">ข้อมูลแปลงเกษตร</h1>
                <button 
                    onClick={() => setActivePage(Page.DASHBOARD)}
                    className="font-bold text-slate-800 hover:text-black flex items-center gap-1 p-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                    <Icons.ChevronLeftIcon className="w-5 h-5" />
                    กลับไปแดชบอร์ด
                </button>
            </div>

            {/* Map Card */}
            <div className="bg-[#F7F6E8] rounded-2xl p-4 border-2 border-black">
                 <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden border border-slate-300 shadow-inner">
                    <PlaceholderMap />
                </div>
            </div>

            {/* Details Card */}
            <div className="bg-[#F7F6E8] rounded-2xl p-6 border-2 border-black">
                <h2 className="text-xl font-bold text-slate-800 mb-4 border-b-2 border-slate-300 pb-2">รายละเอียดที่ดิน</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-slate-800">
                    <p><strong className="font-semibold text-slate-900">พื้นที่ทั้งหมด:</strong> {details.totalArea}</p>
                    <p><strong className="font-semibold text-slate-900">พื้นที่พืชอื่น:</strong> {details.otherCropsArea}</p>
                    <p><strong className="font-semibold text-slate-900">ประเภทดิน:</strong> {details.soilType}</p>
                    <p><strong className="font-semibold text-slate-900">แหล่งน้ำ:</strong> {details.waterSource}</p>
                </div>
                <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">การแบ่งพื้นที่:</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-800">
                        {details.plotBreakdown.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default PlotDetailsPage;