// features/farmer/FarmerView.tsx
// คอมโพเนนต์หลักสำหรับมุมมองของเกษตรกร (Farmer)
// ทำหน้าที่เป็น Layout หลักและจัดการ State ที่ใช้ร่วมกันระหว่างหน้าย่อยต่างๆ ของเกษตรกร

import React, { useState, useMemo } from 'react';
import { Page, UserRole, Booking, BookingStatus, Profile } from '../../types';
import * as mockData from '../../data/mockData';
import KnowledgeBasePage from '../../components/KnowledgeBasePage';
import FarmerDashboard from './FarmerDashboard';
import FarmerProfilePage from './FarmerProfilePage';
import FarmerBookingPage from './FarmerBookingPage';
import FinanceLogisticsPage from './FinanceLogisticsPage';
import BookingDetailsModal from './BookingDetailsModal';
import FarmerHeader from './FarmerHeader';
import PlotManagementPage from './PlotManagementPage';
import Card from '../../components/Card';
import FarmerSidebar from './FarmerSidebar';
import NotificationSidebar from '../../components/NotificationSidebar';


// Props ที่คอมโพเนนต์นี้ต้องการ
interface FarmerViewProps {
    onLogout: () => void; // ฟังก์ชันสำหรับ Logout
}

const FarmerView: React.FC<FarmerViewProps> = ({ onLogout }) => {
    // =================================================================
    // State Management
    // =================================================================
    const [activePage, setActivePage] = useState<Page>(Page.DASHBOARD); // State สำหรับหน้าที่กำลังแสดงผล
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null); // ID ของบทความที่เลือก (สำหรับหน้าคลังความรู้)
    const [bookings, setBookings] = useState<Booking[]>(mockData.farmerBookings); // State สำหรับรายการจองคิว
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null); // การจองที่เลือก (สำหรับแสดงใน Modal)
    const [profile, setProfile] = useState<Profile>(mockData.farmerProfile); // State ข้อมูลโปรไฟล์
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isNotificationOpen, setNotificationOpen] = useState(false);


    // =================================================================
    // Handlers
    // =================================================================
    
    // จัดการการคลิกเมนู
    const handleNavClick = (page: Page) => {
        setSelectedArticleId(null); // เคลียร์บทความที่เลือกเมื่อเปลี่ยนหน้า
        setActivePage(page);
        setIsSidebarOpen(false); // Close sidebar on navigation
    };

    // จัดการเมื่อเลือกบทความจากหน้าอื่น (เช่น Dashboard)
    const handleSelectArticle = (articleId: string) => {
        setSelectedArticleId(articleId);
        setActivePage(Page.KNOWLEDGE); // เปลี่ยนไปหน้าคลังความรู้
    };

    // จัดการเมื่อต้องการดูรายละเอียดการจอง
    const handleViewBookingDetails = (booking: Booking) => {
        setSelectedBooking(booking);
    };

    // จัดการเมื่อมีการเพิ่มการจองใหม่
    const handleAddBooking = (newBookingData: { description: string; date: string; }) => {
        const newBooking: Booking = {
            id: `b${bookings.length + 1}-${Date.now()}`, // สร้าง ID ที่ไม่ซ้ำกัน
            ...newBookingData,
            status: BookingStatus.PENDING,
            userType: UserRole.FARMER,
            userName: `${profile.firstName} ${profile.lastName}`,
        };
        // เพิ่มการจองใหม่เข้าไปใน State โดยให้แสดงผลบนสุด
        setBookings(prevBookings => [newBooking, ...prevBookings]);
    };
    
    // จัดการการอัปเดตโปรไฟล์
    const handleUpdateProfile = (updatedProfile: Profile) => {
        setProfile(updatedProfile);
    };

    // =================================================================
    // Render Logic
    // =================================================================
    
    const PlaceholderPage: React.FC<{title: string}> = ({title}) => (
        <Card className="text-center p-16">
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            <p className="mt-4 text-slate-600">หน้านี้อยู่ในระหว่างการพัฒนา</p>
        </Card>
    );

    const renderPageContent = () => {
        switch(activePage) {
            case Page.DASHBOARD:
                return <FarmerDashboard onMenuClick={() => setIsSidebarOpen(true)} onNotificationClick={() => setNotificationOpen(true)} />;
            case Page.PLOT_MANAGEMENT:
                return <PlotManagementPage details={mockData.plotDetails} onNavigate={handleNavClick} />;
            case Page.PROFILE: 
                return <FarmerProfilePage 
                    profile={profile} 
                    onUpdateProfile={handleUpdateProfile}
                    onMenuClick={() => setIsSidebarOpen(true)}
                    onNotificationClick={() => setNotificationOpen(true)}
                />;
            case Page.BOOKING: return <FarmerBookingPage bookings={bookings} onAddBooking={handleAddBooking} onViewDetails={handleViewBookingDetails} />;
            case Page.FINANCE: return <FinanceLogisticsPage shipments={mockData.farmerShipments} payments={mockData.farmerPayments} />;
            case Page.KNOWLEDGE: 
                return <KnowledgeBasePage 
                            articles={mockData.knowledgeArticles.filter(a => a.status === 'เผยแพร่แล้ว')}
                            initialSelectedArticleId={selectedArticleId}
                            onClearSelection={() => setSelectedArticleId(null)}
                        />;
            case Page.CONTRACT:
                return <PlaceholderPage title={Page.CONTRACT} />;
            case Page.CHECK_STATUS:
                return <PlaceholderPage title={Page.CHECK_STATUS} />;
            case Page.SHIPMENT_STATUS:
                    return <PlaceholderPage title={Page.SHIPMENT_STATUS} />;
            default: 
                return <FarmerDashboard onMenuClick={() => setIsSidebarOpen(true)} onNotificationClick={() => setNotificationOpen(true)} />;
        }
    }
    
    const isDashboard = activePage === Page.DASHBOARD;
    const isProfilePage = activePage === Page.PROFILE;
    
    // The main content is now rendered conditionally inside the main layout
    const mainContent = renderPageContent();

    return (
        <div className="bg-[#F0F5F9]">
            <FarmerSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                profile={profile}
                onNavigate={handleNavClick}
                onLogout={onLogout}
            />
            
            <NotificationSidebar
                isOpen={isNotificationOpen}
                onClose={() => setNotificationOpen(false)}
                notifications={mockData.mockSimpleNotifications}
            />
            
            {/* Conditional rendering for different page layouts */}
            {isDashboard && mainContent}
            {isProfilePage && mainContent}
            
            {!isDashboard && !isProfilePage && (
                <div>
                    <FarmerHeader 
                        title={activePage}
                        onMenuClick={() => setIsSidebarOpen(true)}
                        onNotificationClick={() => setNotificationOpen(true)}
                    />
                    <main className="container mx-auto p-4 sm:p-6 lg:p-8 -mt-16 relative z-10">
                        {mainContent}
                    </main>
                </div>
            )}


            <BookingDetailsModal
                booking={selectedBooking}
                onClose={() => setSelectedBooking(null)}
            />
        </div>
    );
};

export default FarmerView;