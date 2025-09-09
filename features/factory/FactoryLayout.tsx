// features/factory/FactoryLayout.tsx
import React, { useState } from 'react';
import { Page, Booking } from '../../types';
import * as mockData from '../../data/mockData';
import FactorySidebar from './FactorySidebar';
import FactoryDashboard from './FactoryDashboard';
import FactoryBookingPage from './FactoryBookingPage';
import Card from '../../components/Card';
import TopHeader from '../../components/TopHeader';


interface FactoryLayoutProps {
    onLogout: () => void;
}

const FactoryLayout: React.FC<FactoryLayoutProps> = ({ onLogout }) => {
    const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD);
    const [schedule, setSchedule] = useState<Booking[]>(mockData.factorySchedule);
    
    const handleUpdateSchedule = (updatedSchedule: Booking[]) => {
        setSchedule(updatedSchedule);
    };

    const renderContent = () => {
        switch (activePage) {
            case Page.DASHBOARD:
                return <FactoryDashboard 
                            schedule={schedule}
                            onUpdateSchedule={handleUpdateSchedule}
                        />;
            case Page.BOOKING:
                return <FactoryBookingPage schedule={schedule} onUpdateSchedule={handleUpdateSchedule} />;
            case Page.FINANCE:
                 return <Card><h1 className="text-3xl font-bold">Factory Finance & Logistics Page</h1><p>This page is under construction.</p></Card>;
            case Page.PROFILE:
                 return <Card><h1 className="text-3xl font-bold">Factory Profile Page</h1><p>This page is under construction.</p></Card>;
            default:
                return <FactoryDashboard 
                            schedule={schedule}
                            onUpdateSchedule={handleUpdateSchedule}
                        />;
        }
    };

    return (
        <div className="flex h-screen bg-[#F0F5F9] text-slate-900">
            <FactorySidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} />
            <div className="flex-1 flex flex-col">
                <TopHeader />
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default FactoryLayout;