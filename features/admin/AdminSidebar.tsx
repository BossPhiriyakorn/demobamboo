// features/admin/AdminSidebar.tsx
// คอมโพเนนต์สำหรับแถบเมนูด้านข้างของหน้าแอดมิน

import React, { useState, useEffect } from 'react';
import * as Icons from '../../constants';

// ประเภทของ Key สำหรับแต่ละหน้าใน Admin panel
export type AdminPageKey =
    | 'dashboard'
    | 'applicants'
    | 'farmer_list'
    | 'factory_list'
    | 'shipments'
    | 'users_farmer'
    | 'users_factory'
    | 'users_promoter'
    | 'users_employee'
    | 'data_species'
    | 'data_equipment'
    | 'data_environment'
    | 'community_articles'
    | 'community_policy'
    | 'carbon_credit'
    | 'queue_seedling'
    | 'queue_cutting';

// Props ที่คอมโพเนนตต้องการ
interface AdminSidebarProps {
    activePage: AdminPageKey;
    setActivePage: (page: AdminPageKey) => void;
    onLogout: () => void;
}

type DropdownKey = 'users' | 'data' | 'queue' | 'community';

// คอมโพเนนต์สำหรับรายการเมนูย่อย
const SubMenuItem: React.FC<{
    label: string;
    pageKey: AdminPageKey;
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
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{label}</span>
        </button>
        {isActive && (
            <div className="absolute left-0 top-0 h-full w-1 bg-[#54B948] rounded-r-full"></div>
        )}
    </div>
);

// คอมโพเนนต์สำหรับเมนูหลักแบบไม่มีเมนูย่อย
const MainMenuItem: React.FC<{
    label: string;
    pageKey: AdminPageKey;
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


const AdminSidebar: React.FC<AdminSidebarProps> = ({ activePage, setActivePage, onLogout }) => {
    const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);

    const userSubPages: AdminPageKey[] = ['users_farmer', 'users_factory', 'users_promoter', 'users_employee'];
    const dataSubPages: AdminPageKey[] = ['data_species', 'data_equipment', 'data_environment'];
    const queueSubPages: AdminPageKey[] = ['queue_seedling', 'queue_cutting'];
    const communitySubPages: AdminPageKey[] = ['community_articles', 'community_policy'];

    // Effect to open the correct dropdown when a sub-page is active
    useEffect(() => {
        if (userSubPages.includes(activePage)) {
            setOpenDropdown('users');
        } else if (dataSubPages.includes(activePage)) {
            setOpenDropdown('data');
        } else if (queueSubPages.includes(activePage)) {
            setOpenDropdown('queue');
        } else if (communitySubPages.includes(activePage)) {
            setOpenDropdown('community');
        } else {
            // Close dropdown if a top-level item is selected
            setOpenDropdown(null);
        }
    }, [activePage]);
    
    const handleToggleDropdown = (key: DropdownKey) => {
        setOpenDropdown(prev => (prev === key ? null : key));
    };

    const DropdownHeader: React.FC<{
        label: string;
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
        dropdownKey: DropdownKey;
        subPages: AdminPageKey[];
    }> = ({ label, icon: Icon, dropdownKey, subPages }) => {
        const isActive = subPages.includes(activePage);
        return (
             <button
                onClick={() => handleToggleDropdown(dropdownKey)}
                className={`w-full flex items-center space-x-3 py-2.5 px-4 rounded-lg text-left transition-colors duration-200 ${
                    isActive ? 'text-white font-semibold' : 'text-blue-100 hover:bg-white/10'
                }`}
            >
                <Icon className="w-6 h-6 flex-shrink-0" />
                <span>{label}</span>
            </button>
        );
    };

    return (
        <aside className="w-64 bg-[#009DD4] flex flex-col h-full shadow-lg text-white">
            {/* ส่วนหัวของ Sidebar */}
            <div className="h-20 flex items-center justify-center px-6">
                <Icons.PreciseLogo className="h-10 w-auto" />
            </div>
            
            {/* รายการเมนู */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <MainMenuItem label="Dashboard" pageKey="dashboard" icon={Icons.HomeIcon} isActive={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
                <MainMenuItem label="ผู้สมัครเข้าร่วมโครงการ" pageKey="applicants" icon={Icons.UserPlusIcon} isActive={activePage === 'applicants'} onClick={() => setActivePage('applicants')} />
                <MainMenuItem label="รายชื่อเกษตรกร" pageKey="farmer_list" icon={Icons.SproutIcon} isActive={activePage === 'farmer_list'} onClick={() => setActivePage('farmer_list')} />
                <MainMenuItem label="รายชื่อโรงงาน" pageKey="factory_list" icon={Icons.BuildingOfficeIcon} isActive={activePage === 'factory_list'} onClick={() => setActivePage('factory_list')} />
                <MainMenuItem label="รายการขนส่ง" pageKey="shipments" icon={Icons.TruckIcon} isActive={activePage === 'shipments'} onClick={() => setActivePage('shipments')} />
                
                {/* เมนูหลัก: ผู้ใช้งานระบบ */}
                <div>
                    <DropdownHeader label="ผู้ใช้งานระบบ" icon={Icons.UserGroupIcon} dropdownKey="users" subPages={userSubPages} />
                    <div className={`grid transition-all duration-300 ease-in-out ${openDropdown === 'users' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <div className="overflow-hidden">
                             <div className="pt-1 pl-6 space-y-1">
                                <SubMenuItem label="เกษตรกร" pageKey="users_farmer" icon={Icons.SproutIcon} isActive={activePage === 'users_farmer'} onClick={() => setActivePage('users_farmer')} />
                                <SubMenuItem label="โรงงาน" pageKey="users_factory" icon={Icons.BuildingOfficeIcon} isActive={activePage === 'users_factory'} onClick={() => setActivePage('users_factory')} />
                                <SubMenuItem label="นักส่งเสริม" pageKey="users_promoter" icon={Icons.AcademicCapIcon} isActive={activePage === 'users_promoter'} onClick={() => setActivePage('users_promoter')} />
                                <SubMenuItem label="พนักงาน" pageKey="users_employee" icon={Icons.BriefcaseIcon} isActive={activePage === 'users_employee'} onClick={() => setActivePage('users_employee')} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* เมนูหลัก: จัดการข้อมูล */}
                <div>
                    <DropdownHeader label="จัดการข้อมูล" icon={Icons.ClipboardDocumentListIcon} dropdownKey="data" subPages={dataSubPages} />
                     <div className={`grid transition-all duration-300 ease-in-out ${openDropdown === 'data' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <div className="overflow-hidden">
                            <div className="pt-1 pl-6 space-y-1">
                                <SubMenuItem label="จัดการข้อมูลสายพันธุ์" pageKey="data_species" icon={Icons.ChartBarIcon} isActive={activePage === 'data_species'} onClick={() => setActivePage('data_species')} />
                                <SubMenuItem label="จัดการข้อมูลอุปกรณ์" pageKey="data_equipment" icon={Icons.WrenchScrewdriverIcon} isActive={activePage === 'data_equipment'} onClick={() => setActivePage('data_equipment')} />
                                <SubMenuItem label="จัดการข้อมูลสิ่งแวดล้อม" pageKey="data_environment" icon={Icons.ClipboardDocumentListIcon} isActive={activePage === 'data_environment'} onClick={() => setActivePage('data_environment')} />
                            </div>
                        </div>
                    </div>
                </div>
                 
                 {/* เมนูหลัก: จัดการระบบชุมชนและความรู้ */}
                <div>
                    <DropdownHeader label="จัดการระบบชุมชนและความรู้" icon={Icons.BookIcon} dropdownKey="community" subPages={communitySubPages} />
                     <div className={`grid transition-all duration-300 ease-in-out ${openDropdown === 'community' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <div className="overflow-hidden">
                            <div className="pt-1 pl-6 space-y-1">
                                <SubMenuItem label="จัดการบทความ" pageKey="community_articles" icon={Icons.DocumentTextIcon} isActive={activePage === 'community_articles'} onClick={() => setActivePage('community_articles')} />
                                <SubMenuItem label="จัดการนโยบาย/ข้อตกลง" pageKey="community_policy" icon={Icons.InformationCircleIcon} isActive={activePage === 'community_policy'} onClick={() => setActivePage('community_policy')} />
                            </div>
                        </div>
                    </div>
                </div>
                
                 <MainMenuItem label="คาร์บอนเครดิต" pageKey="carbon_credit" icon={Icons.TrendingUpIcon} isActive={activePage === 'carbon_credit'} onClick={() => setActivePage('carbon_credit')} />

                {/* เมนูหลัก: การจัดการคิว */}
                <div>
                    <DropdownHeader label="การจัดการคิว" icon={Icons.CalendarIcon} dropdownKey="queue" subPages={queueSubPages} />
                    <div className={`grid transition-all duration-300 ease-in-out ${openDropdown === 'queue' ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                        <div className="overflow-hidden">
                             <div className="pt-1 pl-6 space-y-1">
                                <SubMenuItem label="จองคิวขอรับกล้าพันธุ์" pageKey="queue_seedling" icon={Icons.SproutIcon} isActive={activePage === 'queue_seedling'} onClick={() => setActivePage('queue_seedling')} />
                                <SubMenuItem label="จองคิวตัดไผ่" pageKey="queue_cutting" icon={Icons.BambooIcon} isActive={activePage === 'queue_cutting'} onClick={() => setActivePage('queue_cutting')} />
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            
            {/* ส่วนท้ายของ Sidebar */}
            <div className="p-4 border-t border-blue-500/50">
                <button onClick={onLogout} className="w-full flex items-center space-x-3 py-2 px-4 rounded-lg text-blue-100 hover:bg-white/10">
                    <Icons.LogoutIcon className="w-6 h-6" />
                    <span>ออกจากระบบ</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
