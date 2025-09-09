// features/factory/FactorySidebar.tsx
import React from 'react';
import { Page, UserRole } from '../../types';
import { factoryNavItems } from '../../constants';
import * as Icons from '../../constants';
import * as mockData from '../../data/mockData';


interface FactorySidebarProps {
    activePage: Page;
    setActivePage: (page: Page) => void;
    onLogout: () => void;
}

const MenuItem: React.FC<{
    label: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon: Icon, isActive, onClick }) => (
     <div className="relative">
        <button
            onClick={onClick}
            className={`w-full flex items-center space-x-3 py-2.5 px-4 rounded-lg text-left transition-colors duration-200 ${
                isActive ? 'text-white font-semibold' : 'text-blue-100 hover:bg-white/10'
            }`}
        >
            <Icon className="w-6 h-6 flex-shrink-0" />
            <span>{label}</span>
        </button>
        {isActive && (
            <div className="absolute left-0 top-0 h-full w-1 bg-[#54B948] rounded-r-full"></div>
        )}
    </div>
);


const FactorySidebar: React.FC<FactorySidebarProps> = ({ activePage, setActivePage, onLogout }) => {
    
    return (
        <aside className="w-64 bg-[#009DD4] flex flex-col h-full shadow-lg text-white">
            {/* Sidebar Header */}
            <div className="h-20 flex items-center justify-center px-6">
                <Icons.PreciseLogo className="h-10 w-auto" />
            </div>
            
            {/* Menu Items */}
            <nav className="flex-1 p-4 space-y-2">
                {factoryNavItems.map(item => (
                     <MenuItem 
                        key={item.page}
                        label={item.page} 
                        icon={item.icon} 
                        isActive={activePage === item.page} 
                        onClick={() => setActivePage(item.page)} 
                    />
                ))}
            </nav>
            
            {/* Sidebar Footer */}
             <div className="p-4 border-t border-blue-500/50">
                <div className="p-3 mb-2 text-center bg-blue-900/50 rounded-lg">
                    <p className="text-sm font-bold text-white">{`${mockData.factoryProfile.firstName} ${mockData.factoryProfile.lastName}`}</p>
                    <p className="text-xs text-blue-200">{UserRole.FACTORY}</p>
                </div>
                 <button className="w-full flex items-center space-x-3 py-2.5 px-4 rounded-lg text-left transition-colors text-blue-100 hover:bg-white/10">
                    <Icons.WrenchScrewdriverIcon className="w-6 h-6 flex-shrink-0" />
                    <span>ตั้งค่า</span>
                </button>
                <button onClick={onLogout} className="w-full flex items-center space-x-3 py-2 px-4 rounded-lg text-blue-100 hover:bg-white/10">
                    <Icons.LogoutIcon className="w-6 h-6" />
                    <span>ออกจากระบบ</span>
                </button>
            </div>
        </aside>
    );
};

export default FactorySidebar;
