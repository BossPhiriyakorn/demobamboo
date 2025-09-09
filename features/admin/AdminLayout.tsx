// features/admin/AdminLayout.tsx
// คอมโพเนนต์สำหรับโครงสร้างหลักของหน้าแอดมิน

import React, { useState } from 'react';
import AdminSidebar, { AdminPageKey } from './AdminSidebar';
import AdminDashboard from './AdminDashboard';
import MasterDataPage from './MasterDataPage';
import TopHeader from '../../components/TopHeader';
import Card from '../../components/Card';
import UserManagementPage from './UserManagementPage';
import CommunityManagementPage from './CommunityManagementPage';
import PolicyManagementPage from './PolicyManagementPage';


// Props ที่คอมโพเนนตต้องการ
interface AdminLayoutProps {
    onLogout: () => void;
    policyContent: string;
    termsContent: string;
    onUpdatePolicies: (newPolicy: string, newTerms: string) => void;
}

// Placeholder for uncreated pages
const PlaceholderContent: React.FC<{ title: string }> = ({ title }) => (
    <Card>
        <div className="text-center p-16">
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            <p className="mt-4 text-slate-600">หน้านี้อยู่ในระหว่างการพัฒนา</p>
        </div>
    </Card>
);


const AdminLayout: React.FC<AdminLayoutProps> = ({ onLogout, policyContent, termsContent, onUpdatePolicies }) => {
    const [activePage, setActivePage] = useState<AdminPageKey>('dashboard');

    // ฟังก์ชันสำหรับ render เนื้อหาตามเมนูที่เลือก
    const renderContent = () => {
        switch (activePage) {
            case 'dashboard':
                return <AdminDashboard />;
            
            // Re-use UserManagementPage for a few old functionalities if needed
            case 'applicants':
                return <UserManagementPage userType="เกษตรกร" pageTitle="จัดการผู้สมัครเข้าร่วมโครงการ" />;
            case 'farmer_list':
                return <UserManagementPage userType="เกษตรกร" pageTitle="จัดการรายชื่อเกษตรกร" />;
            case 'factory_list':
                 return <UserManagementPage userType="โรงงาน/ผู้รับซื้อ" pageTitle="จัดการรายชื่อโรงงาน/ผู้รับซื้อ" />;
            
            // Sub-menu of 'ผู้ใช้งานระบบ'
            case 'users_farmer':
                return <UserManagementPage userType="เกษตรกร" pageTitle="จัดการผู้ใช้งานระบบ: เกษตรกร" />;
            case 'users_factory':
                return <UserManagementPage userType="โรงงาน/ผู้รับซื้อ" pageTitle="จัดการผู้ใช้งานระบบ: โรงงาน" />;
            case 'users_promoter':
                return <PlaceholderContent title="ผู้ใช้งานระบบ: นักส่งเสริม" />;
            case 'users_employee':
                return <PlaceholderContent title="ผู้ใช้งานระบบ: พนักงาน" />;

            // Sub-menu of 'จัดการข้อมูล'
            case 'data_species':
                return <MasterDataPage activeTab="species" />;
            case 'data_equipment':
                return <MasterDataPage activeTab="equipment" />;
            case 'data_environment':
                return <MasterDataPage activeTab="environment" />;
            
            // Sub-menu of 'จัดการระบบชุมชนและความรู้'
            case 'community_articles':
                return <CommunityManagementPage />;
            case 'community_policy':
                return <PolicyManagementPage 
                            policyContent={policyContent}
                            termsContent={termsContent}
                            onSave={onUpdatePolicies}
                        />;
            
            // New placeholder pages
            case 'shipments':
                return <PlaceholderContent title="รายการขนส่ง" />;
            case 'carbon_credit':
                return <PlaceholderContent title="คาร์บอนเครดิต" />;
            case 'queue_seedling':
                return <PlaceholderContent title="การจัดการคิว: จองคิวขอรับกล้าพันธุ์" />;
            case 'queue_cutting':
                return <PlaceholderContent title="การจัดการคิว: จองคิวตัดไผ่" />;

            default:
                return <AdminDashboard />;
        }
    };
    
    return (
        <div className="flex h-screen bg-[#F0F5F9] text-slate-900">
            <AdminSidebar activePage={activePage} setActivePage={setActivePage} onLogout={onLogout} />
            <div className="flex-1 flex flex-col">
                <TopHeader />
                <main className="flex-1 p-6 lg:p-10 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;