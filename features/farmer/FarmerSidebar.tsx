// features/farmer/FarmerSidebar.tsx

import React from 'react';
import { Page, Profile } from '../../types';
import * as Icons from '../../constants';
import { ScooterIcon } from '../../constants';

interface FarmerSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    profile: Profile;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}

const sidebarItems = [
    { label: 'หน้าหลัก', page: Page.DASHBOARD, icon: Icons.HomeIcon },
    { label: 'แปลงปลูก', page: Page.PLOT_MANAGEMENT, icon: Icons.SproutIcon, useImage: true, imageSrc: '/Icon Menu (1).png', disabled: true },
    { label: 'สัญญา', page: Page.CONTRACT, icon: Icons.DocumentTextIcon, useImage: true, imageSrc: '/Frame 1597884474.png' },
    { label: 'ตรวจสอบสถานะ', page: Page.CHECK_STATUS, icon: Icons.ClipboardDocumentCheckIcon },
    { label: 'จองคิว', page: Page.BOOKING, icon: Icons.ClipboardDocumentListIcon, useImage: true, imageSrc: '/Icon Menu (3).png' },
    { label: 'สถานะขนส่ง', page: Page.SHIPMENT_STATUS, icon: ScooterIcon, useImage: true, imageSrc: '/Icon Menu (4).png' },
];


const FarmerSidebar: React.FC<FarmerSidebarProps> = ({ isOpen, onClose, profile, onNavigate, onLogout }) => {

    const handleNavigate = (page: Page, disabled?: boolean) => {
        if (disabled) {
            return; // ไม่ทำอะไรถ้า disabled
        }
        onNavigate(page);
        onClose();
    };

    const handleLogout = () => {
        onLogout();
        onClose();
    };

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full text-white w-72 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 rounded-r-2xl ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ background: 'linear-gradient(to bottom, #005596, #009DDC)' }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="sidebar-title"
            >
                <div className="flex flex-col h-full p-4">
                    {/* Header */}
                    <div className="flex items-center justify-center py-4">
                        <img 
                            src="/LOGO_CMYK_ART_PRECISE (Original)_Precise 2.png" 
                            alt="PRECISE Logo" 
                            className="h-10 w-auto" 
                        />
                    </div>
                    <div className="w-full h-px bg-white/20 mb-4"></div>


                    {/* Profile */}
                    <button 
                        onClick={() => handleNavigate(Page.PROFILE)} 
                        className="flex items-center gap-4 py-4 px-2 text-left w-full hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <img src={profile.avatarUrl} alt="Profile" className="w-16 h-16 rounded-full border-2 border-white/50 object-cover" />
                        <div>
                            <p id="sidebar-title" className="font-bold text-lg">{`${profile.firstName} ${profile.lastName}`}</p>
                            <p className="text-sm text-blue-200">User name</p>
                        </div>
                    </button>

                    {/* Navigation */}
                    <nav className="flex-grow pt-2 pb-4 space-y-2">
                        {sidebarItems.map(item => (
                            <button
                                key={item.page}
                                onClick={() => handleNavigate(item.page, item.disabled)}
                                disabled={item.disabled}
                                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left text-lg font-medium transition-colors ${
                                    item.disabled 
                                        ? 'text-gray-400 cursor-not-allowed opacity-50' 
                                        : 'text-blue-100 hover:bg-white/10'
                                }`}
                            >
                                {item.useImage ? (
                                    <img 
                                        src={item.imageSrc} 
                                        alt={item.label} 
                                        className={`w-7 h-7 flex-shrink-0 ${item.disabled ? 'grayscale' : ''}`} 
                                    />
                                ) : (
                                    <item.icon className={`w-7 h-7 flex-shrink-0 ${item.disabled ? 'text-gray-400' : ''}`} />
                                )}
                                <span>{item.label}</span>
                                {item.disabled && (
                                    <span className="ml-auto text-xs text-gray-400">(เร็วๆ นี้)</span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Logout Button */}
                    <div className="mt-auto pt-4">
                         <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left text-lg font-medium text-red-200 hover:bg-red-500/50 hover:text-white transition-colors"
                        >
                            <Icons.LogoutIcon className="w-7 h-7 flex-shrink-0" />
                            <span>ออกจากระบบ</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default FarmerSidebar;
