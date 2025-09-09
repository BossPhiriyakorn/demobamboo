// features/farmer/FarmerProfilePage.tsx
// คอมโพเนนต์สำหรับหน้าโปรไฟล์ของเกษตรกร (ดีไซน์ใหม่)

import React, { useState } from 'react';
import { Profile, PromoterInfo, FarmerStatus } from '../../types';
import * as Icons from '../../constants';
import ProfileEditModal from './ProfileEditModal';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface FarmerProfilePageProps {
    profile: Profile;
    onUpdateProfile: (updatedProfile: Profile) => void;
    onMenuClick: () => void;
    onNotificationClick: () => void;
}

// Helper: คอมโพเนนต์สำหรับการ์ดแสดงข้อมูล
const InfoCard: React.FC<{
    title: string;
    children: React.ReactNode;
    statusElement?: React.ReactNode;
}> = ({ title, children, statusElement }) => (
    <div className="relative">
        <div className="absolute left-6 -top-5">
            <div className="bg-[#003A70] text-white font-thin py-2 px-6 rounded-full shadow-md">
                {title}
            </div>
        </div>
        {statusElement}
        <div className="bg-white rounded-2xl shadow-lg p-6 pt-10 space-y-5">
            {children}
        </div>
    </div>
);

// Helper: คอมโพเนนต์สำหรับแสดงข้อมูลแต่ละรายการ (ไอคอน, หัวข้อ, ข้อมูล)
const InfoItem: React.FC<{
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: string | undefined;
}> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4">
        <Icon className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
        <div>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="text-base font-bold text-slate-800">{value || '-'}</p>
        </div>
    </div>
);

// Helper: คอมโพเนนต์สำหรับแสดงชื่อ นามสกุล (ตัวบาง)
const NameInfoItem: React.FC<{
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    value: string | undefined;
}> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4">
        <Icon className="w-6 h-6 text-slate-600 flex-shrink-0 mt-1" />
        <div>
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="text-base font-light text-slate-800">{value || '-'}</p>
        </div>
    </div>
);


const FarmerProfilePage: React.FC<FarmerProfilePageProps> = ({ profile, onUpdateProfile, onMenuClick, onNotificationClick }) => {
    // State สำหรับควบคุมการเปิด/ปิด Modal แก้ไขโปรไฟล์
    const [isEditModalOpen, setEditModalOpen] = useState(false);

    // ฟังก์ชันสำหรับจัดการเมื่อบันทึกข้อมูลที่แก้ไข
    const handleSaveProfile = (updatedProfile: Profile) => {
        onUpdateProfile(updatedProfile);
        setEditModalOpen(false);
    };

    // Helper function to determine status color
    const getStatusColor = (status: FarmerStatus) => {
        switch (status) {
            case FarmerStatus.APPROVED:
                return 'text-green-500';
            case FarmerStatus.PENDING:
                return 'text-yellow-500';
            case FarmerStatus.REJECTED:
                return 'text-red-500';
            default:
                return 'text-gray-500';
        }
    };

    const statusElement = (
        <div className="absolute top-6 right-6 text-sm">
            <span className="font-bold text-slate-800">สถานะ : </span>
            <span className={`font-bold ${getStatusColor(profile.status)}`}>
                {profile.status}
            </span>
        </div>
    );

    return (
        // Background with Group.png image and gradient
        <div 
            className="relative min-h-screen overflow-x-hidden"
            style={{
                backgroundImage: "url('/Group.png')",
                backgroundPosition: 'bottom right',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'contain'
            }}
        >
            {/* Gradient overlay from #D7EDFD to #005596 */}
            <div 
                className="absolute inset-0"
                style={{ 
                    background: 'linear-gradient(to bottom, #D7EDFD, #005596)' 
                }}
            ></div>
            {/* Custom Header */}
            <div 
                className="absolute top-0 left-0 right-0 h-48 bg-cover bg-center rounded-b-3xl z-10"
                style={{ backgroundImage: "url('/images/banners/ดีไซน์ที่ยังไม่ได้ตั้งชื่อ (1) 3.png')" }}
            >
                <div className="absolute inset-0 rounded-b-3xl" style={{ background: 'linear-gradient(to bottom, rgba(0, 85, 150, 0.8), rgba(0, 85, 150, 0.8), rgba(0, 85, 150, 0.8))' }}></div>
                <div className="relative z-10 flex items-center justify-between p-4 pt-6 text-white">
                    <button onClick={onMenuClick} className="p-2"><Icons.Bars3Icon className="w-7 h-7"/></button>
                    <h1 className="text-xl font-bold">โปรไฟล์</h1>
                    <button onClick={onNotificationClick} className="p-2"><Icons.BellIcon className="w-7 h-7"/></button>
                </div>
            </div>

            {/* Profile Picture */}
            <div className="absolute top-32 left-1/2 -translate-x-1/2 z-20">
                <div className="relative">
                    <div className="w-32 h-32 bg-gray-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                         <img src={profile.avatarUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                    </div>
                    <button
                        onClick={() => setEditModalOpen(true)}
                        className="absolute bottom-0 right-0 w-10 h-10 bg-[#005A9C] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white hover:bg-blue-800 transition-colors"
                        aria-label="แก้ไขโปรไฟล์"
                    >
                        <Icons.PencilIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
            
            {/* Main Content */}
            <main className="relative pt-60 px-4 pb-8">
                <div className="mt-8 space-y-10 max-w-lg mx-auto">
                    {/* Personal Info Card */}
                    <InfoCard title="ข้อมูลส่วนตัว" statusElement={statusElement}>
                        <NameInfoItem 
                            icon={Icons.UserOutlineIcon}
                            label="ชื่อ นามสกุล"
                            value={`นาย${profile.firstName} ${profile.lastName}`}
                        />
                         <InfoItem 
                            icon={Icons.PhoneOutlineIcon}
                            label="เบอร์โทรศัพท์"
                            value={profile.phone}
                        />
                        <InfoItem 
                            icon={Icons.MapPinIcon}
                            label="ที่อยู่"
                            value={profile.address.fullAddressText}
                        />
                         <InfoItem 
                            icon={Icons.MailOutlineIcon}
                            label="อีเมล"
                            value={profile.email}
                        />
                    </InfoCard>

                    {/* Promoter Info Card */}
                    {profile.promoterInfo && (
                        <InfoCard title="ข้อมูลนักส่งเสริม">
                            <InfoItem 
                                icon={Icons.UserOutlineIcon}
                                label="ชื่อ นามสกุล"
                                value={profile.promoterInfo.name}
                            />
                            <InfoItem 
                                icon={Icons.PhoneOutlineIcon}
                                label="เบอร์โทรศัพท์"
                                value={profile.promoterInfo.phone}
                            />
                            <InfoItem 
                                icon={Icons.MailOutlineIcon}
                                label="อีเมล"
                                value={profile.promoterInfo.email}
                            />
                        </InfoCard>
                    )}
                </div>
            </main>

            {/* Background Wave SVG - New version */}
            <div className="absolute bottom-0 left-0 w-full h-64 z-0 pointer-events-none">
                <svg
                    className="w-full h-full"
                    preserveAspectRatio="none"
                    viewBox="0 0 1440 256"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M-200 100 Q 160 20, 520 100 T 1240 100 T 1960 100" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 115 Q 160 35, 520 115 T 1240 115 T 1960 115" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 130 Q 160 50, 520 130 T 1240 130 T 1960 130" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 145 Q 160 65, 520 145 T 1240 145 T 1960 145" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 160 Q 160 80, 520 160 T 1240 160 T 1960 160" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 175 Q 160 95, 520 175 T 1240 175 T 1960 175" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 190 Q 160 110, 520 190 T 1240 190 T 1960 190" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-200 205 Q 160 125, 520 205 T 1240 205 T 1960 205" stroke="white" strokeOpacity="0.1" strokeWidth="2" />
                    <path d="M-150 90 Q 210 10, 570 90 T 1290 90 T 2010 90" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
                    <path d="M-150 125 Q 210 45, 570 125 T 1290 125 T 2010 125" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
                    <path d="M-150 155 Q 210 75, 570 155 T 1290 155 T 2010 155" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
                    <path d="M-150 185 Q 210 105, 570 185 T 1290 185 T 2010 185" stroke="white" strokeOpacity="0.1" strokeWidth="1.5" />
                </svg>
            </div>
            
             {/* Modal สำหรับแก้ไขโปรไฟล์ */}
            <ProfileEditModal
                isOpen={isEditModalOpen}
                onClose={() => setEditModalOpen(false)}
                profile={profile}
                onSave={handleSaveProfile}
            />
        </div>
    );
};

export default FarmerProfilePage;