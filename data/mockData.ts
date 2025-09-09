// data/mockData.ts
// ไฟล์นี้ใช้สำหรับเก็บข้อมูลจำลอง (Mock Data) ทั้งหมดที่ใช้ในการพัฒนาแอปพลิเคชัน
// เพื่อให้สามารถทดสอบการทำงานของแต่ละส่วนได้โดยไม่ต้องเชื่อมต่อกับฐานข้อมูลจริง

import {
  UserRole,
  Page,
  BookingStatus,
  ShipmentStatus,
  PaymentStatus,
  Booking,
  Shipment,
  Payment,
  Profile,
  KnowledgeArticle,
  Notification,
  NotificationType,
  AdminUser,
  UserStatus,
  AdminActivity,
  BambooSpecies,
  Equipment,
  EnvironmentalData,
  MonitoringRequest,
  MonitoringRequestStatus,
  KnowledgeArticleStatus,
  FactoryBooking,
  FarmerBooking,
  MonthlyQuota,
  AdminNews,
  PlotDetails,
  SimpleNotification,
  FarmerStatus,
} from '../types';
import * as Icons from '../constants';

// ข้อมูลโปรไฟล์จำลองของเกษตรกร
export const farmerProfile: Profile = {
  firstName: 'วันนี้',
  lastName: 'อยากรวย',
  phone: 'xxx-xxx-xxxx',
  email: 'wannie_y@example.com',
  lineId: 'wannie_y',
  address: {
    province: 'กรุงเทพมหานคร',
    district: 'บางกอกน้อย',
    subdistrict: 'บางขุนนนท์',
    postalCode: '10700', // Note: Corrected postal code for Bang Khun Non
    moo: '9',
    street: 'ถนนจรัญสนิทวงศ์',
    soi: '',
    fullAddressText: '11/11 หมู่ 9 ถนนจรัญสนิทวงศ์ แขวงบางขุนนนท์ เขตบางกอกน้อย จังหวัดกรุงเทพมหานคร 10700',
  },
  avatarUrl: 'https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg',
  status: FarmerStatus.APPROVED,
  promoterInfo: {
    name: 'นายสมพง มีเงิน',
    phone: 'xxx-xxx-xxxx',
    email: 'xxx@example.com',
  }
};

// ข้อมูลโปรไฟล์จำลองของโรงงาน
export const factoryProfile: Profile = {
  firstName: 'ผู้ประสานงาน',
  lastName: 'โรงงานไผ่เจริญ',
  phone: '02-111-2222',
  email: 'contact@paijaroen.co.th',
  lineId: 'paijaroen_factory',
  address: {
    province: 'สมุทรปราการ',
    district: 'เมืองสมุทรปราการ',
    subdistrict: 'แพรกษา',
    postalCode: '10280',
    moo: '4',
    street: 'สุขุมวิท',
    soi: 'นิคมอุตสาหกรรมบางปู',
  },
  avatarUrl: 'https://avatar.iran.liara.run/public/job/factory-worker/male',
  status: FarmerStatus.APPROVED, // Assuming factory has a status too
};

// =================================================================
// การจัดการวันที่ (Date Handling)
// =================================================================
const today = new Date();
today.setHours(0, 0, 0, 0); // ตั้งเวลาเป็นเที่ยงคืนเพื่อการเปรียบเทียบที่แม่นยำ
const formattedToday = today.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace('พ.ศ. ','');

const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
const formattedTomorrow = tomorrow.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace('พ.ศ. ','');

const nextWeek = new Date();
nextWeek.setDate(today.getDate() + 7);
const formattedNextWeek = nextWeek.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace('พ.ศ. ','');


// ฟังก์ชันแปลงสตริงวันที่ (dd/mm/yy) เป็น Date object เพื่อใช้ในการเรียงลำดับ
const parseBookingDate = (dateStr: string): Date => {
    if (!dateStr) return new Date(0); // Handle undefined/null dates
    if (dateStr === formattedToday) return today;
    if (dateStr === formattedTomorrow) return tomorrow;
    
    // Handle dd/mm/yy format
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      // หมายเหตุ: ปีเป็น พ.ศ. ต้องลบ 543 เพื่อแปลงเป็น ค.ศ. สำหรับ Date object
      // '68' will be parsed as 1968, so we add 2500 to make it Buddhist year 2568, then convert to AD
      const year = parseInt(parts[2], 10);
      return new Date(year + 2500 - 543, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
    }

    // Handle other formats (very basic, for mock data only)
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) return d;
    } catch (e) {
      // ignore
    }

    return new Date(0);
};

// =================================================================
// ข้อมูลการจอง (Booking Data)
// =================================================================
const unsortedFarmerBookings: FarmerBooking[] = [
  { id: 'b011', date: '14/07/68', description: 'โรงงานไม่เจริญเข้ารับซื้อไผ่', status: BookingStatus.PENDING, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b012', date: '16/07/68', description: 'นัดตรวจสอบคุณภาพดิน', status: BookingStatus.CONFIRMED, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b013', date: '17/07/68', description: 'อบรมการใช้ปุ๋ย', status: BookingStatus.PENDING, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b014', date: '23/07/68', description: 'ส่งมอบผลผลิต', status: BookingStatus.COMPLETED, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b001', date: '25/07/68', description: 'โรงงาน...เข้ารับซื้อไผ่', status: BookingStatus.PENDING, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b007', date: formattedToday, description: 'โรงงานไผ่เจริญ เข้ารับซื้อ', status: BookingStatus.PENDING, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b006', date: formattedTomorrow, description: 'ขอรับปุ๋y', status: BookingStatus.PENDING, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b002', date: '22/07/68', description: 'ขอรับปุ๋ย', status: BookingStatus.PENDING, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b003', date: '25/05/68', description: 'ขอรับเมล็ดพันธุ์', status: BookingStatus.COMPLETED, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b004', date: '10/03/68', description: 'โรงงาน...เข้ารับซื้อไผ่', status: BookingStatus.COMPLETED, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b005', date: '11/02/68', description: 'โรงงาน...เข้ารับซื้อไผ่', status: BookingStatus.COMPLETED, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b008', date: '18/07/68', description: 'จองคิวตัด/เก็บเกี่ยว: แป', status: BookingStatus.PENDING, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b009', date: '09/07/68', description: 'โรงงานไผ่เจริญ เข้ารับซื้อ', status: BookingStatus.PENDING, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
  { id: 'b010', date: '10/07/68', description: 'ขอรับปุ๋ย', status: BookingStatus.PENDING, userType: UserRole.FARMER, userName: `${farmerProfile.firstName} ${farmerProfile.lastName}` },
];

// เรียงลำดับการจองคิวตามวันที่จากล่าสุดไปเก่าสุด
export const farmerBookings: FarmerBooking[] = unsortedFarmerBookings.sort((a, b) => parseBookingDate(b.date).getTime() - parseBookingDate(a.date).getTime());

export const factorySchedule: FactoryBooking[] = [
    { id: 'fb001', date: '14/07/68', description: 'เข้ารับซื้อไผ่ 5 ตัน', status: BookingStatus.PENDING, userType: UserRole.FACTORY, userName: `${factoryProfile.firstName} ${factoryProfile.lastName}`, farmerName: 'สมชาย รักการเกษตร', pickupLocation: '123 หมู่ 4 ต.บ้านไผ่ อ.บ้านไผ่ จ.ขอนแก่น 40110', estimatedQuantity: "5 ตัน", address: '123 หมู่ 4 ต.บ้านไผ่ อ.บ้านไผ่ จ.ขอนแก่น 40110' },
    { id: 'fb002', date: '18/07/68', description: 'เข้ารับซื้อไผ่ 10 ตัน', status: BookingStatus.CONFIRMED, userType: UserRole.FACTORY, userName: `${factoryProfile.firstName} ${factoryProfile.lastName}`, farmerName: 'สมใจ ทำสวน', pickupLocation: '456 หมู่ 5 ต.โคกสูง อ.เมือง จ.นครราชสีมา 30000', estimatedQuantity: "10 ตัน", address: '456 หมู่ 5 ต.โคกสูง อ.เมือง จ.นครราชสีมา 30000' },
    { id: 'fb003', date: '25/07/68', description: 'เข้ารับซื้อไผ่ 7 ตัน', status: BookingStatus.PENDING, userType: UserRole.FACTORY, userName: `${factoryProfile.firstName} ${factoryProfile.lastName}`, farmerName: 'มานะ ปลูกไผ่', pickupLocation: '789 หมู่ 6 ต.หนองไผ่ อ.หนองไผ่ จ.เพชรบูรณ์ 67140', estimatedQuantity: "7 ตัน", address: '789 หมู่ 6 ต.หนองไผ่ อ.หนองไผ่ จ.เพชรบูรณ์ 67140' },
];

export const allAdminBookings: Booking[] = [...farmerBookings, ...factorySchedule].sort((a, b) => parseBookingDate(b.date).getTime() - parseBookingDate(a.date).getTime());


// =================================================================
// ข้อมูลการขนส่ง (Shipment Data)
// =================================================================
const allShipments: Shipment[] = [
    { id: 's001', title: 'การขนส่ง: ตัด/เก็บเกี่ยว', date: formattedToday, from: 'สวนไผ่สมชาย', to: 'โรงงานไผ่เจริญ', status: ShipmentStatus.IN_TRANSIT },
    { id: 's002', title: 'การขนส่ง: ตัด/เก็บเกี่ยว', date: '10/03/68', from: 'สวนไผ่สมชาย', to: 'โรงงานไผ่ไทย', status: ShipmentStatus.DELIVERED },
    { id: 's003', title: 'การขนส่ง: ส่งคืนปุ๋ย', date: '05/03/68', from: 'สวนไผ่สมชาย', to: 'ศูนย์กระจายสินค้า', status: ShipmentStatus.DELIVERED },
    { id: 's004', title: 'การขนส่ง: ตัด/เก็บเกี่ยว', date: '28/02/68', from: 'สวนไผ่สมชาย', to: 'โรงงานไผ่เจริญ', status: ShipmentStatus.DELIVERED },
    { id: 's005', title: 'การขนส่ง: ตัด/เก็บเกี่ยว', date: '20/02/68', from: 'สวนไผ่สมชาย', to: 'โรงงานไผ่ไทย', status: ShipmentStatus.DELIVERED },
    { id: 's006', title: 'การขนส่ง: รับเมล็ดพันธุ์', date: '15/02/68', from: 'ศูนย์วิจัยพันธุ์พืช', to: 'สวนไผ่สมชาย', status: ShipmentStatus.DELIVERED },
    { id: 's007', title: 'การขนส่ง: ตัด/เก็บเกี่ยว', date: '11/02/68', from: 'สวนไผ่สมชาย', to: 'โรงงานไผ่ดีเลิศ', status: ShipmentStatus.DELIVERED },
    { id: 's008', title: 'การขนส่ง: ตัด/เก็บเกี่ยว', date: '01/02/68', from: 'สวนไผ่สมชาย', to: 'โรงงานไผ่ไทย', status: ShipmentStatus.DELIVERED },
    { id: 's009', title: 'การขนส่ง: ตัด/เก็บเกี่ยว', date: '25/01/68', from: 'สวนไผ่สมชาย', to: 'โรงงานไผ่เจริญ', status: ShipmentStatus.DELIVERED },
    { id: 's010', title: 'การขนส่ง: รับอุปกรณ์', date: '20/01/68', from: 'ร้านเกษตรภัณฑ์', to: 'สวนไผ่สมชาย', status: ShipmentStatus.DELIVERED },
    { id: 's011', title: 'การขนส่ง: ตัด/เก็บเกี่ยว', date: '15/01/68', from: 'สวนไผ่สมชาย', to: 'โรงงานไผ่ไทย', status: ShipmentStatus.DELIVERED },
    { id: 's012', title: 'การขนส่ง: ตัด/เก็บเกี่ยว', date: '10/01/68', from: 'สวนไผ่สมชาย', to: 'โรงงานไผ่ดีเลิศ', status: ShipmentStatus.DELIVERED },
    { id: 's013', title: 'การขนส่ง: ตัด/เก็บเกี่ยว', date: '05/01/68', from: 'สวนไผ่สมชาย', to: 'โรงงานไผ่เจริญ', status: ShipmentStatus.DELIVERED },
];
export const farmerShipments: Shipment[] = allShipments;

// =================================================================
// ข้อมูลการเงิน (Payment Data)
// =================================================================
export const farmerPayments: Payment[] = [
  { id: 'p001', description: 'รายรับจากการขายไผ่ (โรงงานไผ่เจริญ)', date: '10/03/68', amount: '+ 15,000.00 ฿', status: PaymentStatus.PAID },
  { id: 'p002', description: 'รายรับจากการขายไผ่ (โรงงานไผ่ไทย)', date: '28/02/68', amount: '+ 22,500.00 ฿', status: PaymentStatus.PAID },
  { id: 'p003', description: 'รายรับจากการขายไผ่ (โรงงานไผ่ดีเลิศ)', date: '11/02/68', amount: '+ 8,000.00 ฿', status: PaymentStatus.PAID },
  { id: 'p004', description: 'รายรับจากการขายไผ่ (โรงงานไผ่เจริญ)', date: '25/01/68', amount: '+ 18,000.00 ฿', status: PaymentStatus.PAID },
  { id: 'p005', description: 'รายรับรอบถัดไป (โรงงานไผ่เจริญ)', date: formattedTomorrow, amount: '+ 12,000.00 ฿', status: PaymentStatus.PENDING },
];

// =================================================================
// คลังความรู้ (Knowledge Base)
// =================================================================
export const knowledgeArticles: KnowledgeArticle[] = [
  { id: 'k001', title: 'การเตรียมดินและการให้น้ำ', category: 'หมวดหมู่ 1', imageUrl: '', content: 'เป็นสิ่งสำคัญในการปลูกไผ่ให้ได้คุณภาพดี การเตรียมดินที่เหมาะสมจะช่วยให้รากไผ่เจริญเติบโตได้ดี...', postDate: '15 มิ.ย. 2568', status: KnowledgeArticleStatus.PUBLISHED },
  { id: 'k002', title: 'ไผ่กิมซุ่ง, ไผ่ตงลืมแล้ง...', category: 'หมวดหมู่ 2', imageUrl: '', content: '5 สายพันธุ์ไผ่เศรษฐกิจยอดนิยมที่ตลาดต้องการสูงและปลูกง่าย', postDate: '12 มิ.ย. 2568', status: KnowledgeArticleStatus.PUBLISHED },
  { id: 'k003', title: 'การจัดการโรคและแมลงในสวนไผ่', category: 'หมวดหมู่ 1', imageUrl: 'https://images.unsplash.com/photo-1587899767727-7a5491560f70?q=80&w=800&auto=format&fit=crop', content: 'ควรหมั่นตรวจสอบแปลงอย่างสม่ำเสมอเพื่อป้องกันการระบาด...', postDate: '10 มิ.ย. 2568', status: KnowledgeArticleStatus.PUBLISHED },
  { id: 'k004', title: 'การตลาดไผ่: ขายที่ไหนดี?', category: 'หมวดหมู่ 3', imageUrl: 'https://images.unsplash.com/photo-1594732168233-1a733cde6038?q=80&w=800&auto=format&fit=crop', content: 'โรงงานแปรรูปและตลาดท้องถิ่นเป็นช่องทางหลักในการจำหน่าย', postDate: '08 มิ.ย. 2568', status: KnowledgeArticleStatus.PUBLISHED },
  { id: 'k005', title: 'เทคนิคการขยายพันธุ์ไผ่แบบง่ายๆ', category: 'หมวดหมู่ 2', imageUrl: 'https://images.unsplash.com/photo-1516586711933-7c3905534346?q=80&w=800&auto=format&fit=crop', content: 'เรียนรู้วิธีการขยายพันธุ์ไผ่ด้วยตัวเอง ทั้งการชำและการแยกเหง้า', postDate: '05 มิ.ย. 2568', status: KnowledgeArticleStatus.PUBLISHED },
  { id: 'k006', title: 'ประโยชน์ของไผ่ในด้านสิ่งแวดล้อม', category: 'หมวดหมู่ 3', imageUrl: 'https://images.unsplash.com/photo-1563286345-23c5a2307593?q=80&w=800&auto=format&fit=crop', content: 'ไผ่ช่วยลดโลกร้อนได้อย่างไร และมีบทบาทอย่างไรในระบบนิเวศ', postDate: '02 มิ.ย. 2568', status: KnowledgeArticleStatus.PUBLISHED },
  { id: 'k007', title: 'การเลือกใช้ปุ๋ยสำหรับไผ่แต่ละช่วงอายุ', category: 'หมวดหมู่ 1', imageUrl: '', content: 'สูตรปุ๋ยที่เหมาะสมสำหรับไผ่เล็ก, ไผ่รุ่น, และไผ่โตเต็มวัย', postDate: '01 มิ.ย. 2568', status: KnowledgeArticleStatus.PUBLISHED },
  { id: 'k008', title: 'การออกแบบสวนไผ่เพื่อการค้า', category: 'หมวดหมู่ 2', imageUrl: 'https://images.unsplash.com/photo-1627923227318-27425a1ca25a?q=80&w=800&auto=format&fit=crop', content: 'วางผังแปลงอย่างไรให้จัดการง่ายและได้ผลผลิตสูงสุด', postDate: '28 พ.ค. 2568', status: KnowledgeArticleStatus.PUBLISHED },
];

// =================================================================
// การแจ้งเตือน (Notifications)
// =================================================================
export const getFarmerNotifications = (bookings: Booking[], articles: KnowledgeArticle[]): Notification[] => {
    const today = new Date();
    const notifications: Notification[] = [];
    
    // Admin Announcement
    notifications.push({
        id: 'n-admin-1',
        type: NotificationType.ADMIN_UPDATE,
        icon: Icons.InformationCircleIcon,
        title: 'ประกาศจากแอดมิน',
        message: 'จะมีการปิดปรับปรุงระบบในวันที่ 30 ก.ค. 2568 เวลา 02:00-04:00',
        date: '20/07/68',
        read: false,
    });
    
    // Booking Reminders for upcoming bookings
    bookings.forEach(booking => {
        const bookingDate = parseBookingDate(booking.date);
        if(isNaN(bookingDate.getTime())) return;
        
        const diffDays = Math.ceil((bookingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays >= 0 && diffDays <= 2 && booking.status !== BookingStatus.COMPLETED) { // Remind for bookings in the next 2 days
            notifications.push({
                id: `n-booking-${booking.id}`,
                type: NotificationType.BOOKING_REMINDER,
                icon: Icons.CalendarIcon,
                title: 'แจ้งเตือนนัดหมาย',
                message: `คุณมีนัดหมาย "${booking.description}" ในวันที่ ${booking.date}`,
                date: booking.date,
                read: false
            });
        }
    });

    // New Knowledge Article
    if(articles.length > 0) {
        const latestArticle = articles[0]; // Assume first is latest for mock purposes
        notifications.push({
            id: `n-knowledge-${latestArticle.id}`,
            type: NotificationType.KNOWLEDGE,
            icon: Icons.BookIcon,
            title: 'บทความใหม่',
            message: `มีบทความใหม่: "${latestArticle.title}"`,
            date: latestArticle.postDate,
            read: true,
        });
    }

    return notifications; // No sorting to avoid date format errors
};

// Data for the slide-out notification panel
export const mockSimpleNotifications: SimpleNotification[] = [
    {
        id: 'sn01',
        message: 'เอกสารการสมัครเข้าร่วมโครงการฯ ได้รับการอนุมัติแล้ว กรุณารอทางนักส่งเสริมติดต่อเพื่อนัดหมายตรวจพื้นที่ อีกครั้ง',
        timestamp: '5 นาทีที่แล้ว',
        isLatest: true,
    },
    {
        id: 'sn02',
        message: 'เอกสารการสมัครเข้าร่วมโครงการฯ ได้รับการอนุมัติแล้ว กรุณารอทางนักส่งเสริมติดต่อเพื่อนัดหมายตรวจพื้นที่ อีกครั้ง',
        timestamp: '5 ชั่วโมงที่แล้ว',
        isLatest: true,
    },
    {
        id: 'sn03',
        message: 'เอกสารการสมัครเข้าร่วมโครงการฯ ได้รับการอนุมัติแล้ว กรุณารอทางนักส่งเสริมติดต่อเพื่อนัดหมายตรวจพื้นที่ อีกครั้ง',
        timestamp: '01/01/11, 11:11 น.',
        isLatest: false,
    },
    {
        id: 'sn04',
        message: 'เอกสารการสมัครเข้าร่วมโครงการฯ ได้รับการอนุมัติแล้ว กรุณารอทางนักส่งเสริมติดต่อเพื่อนัดหมายตรวจพื้นที่ อีกครั้ง',
        timestamp: '01/02/11, 11:12 น.',
        isLatest: false,
    },
    {
        id: 'sn05',
        message: 'เอกสารการสมัครเข้าร่วมโครงการฯ ได้รับการอนุมัติแล้ว กรุณารอทางนักส่งเสริมติดต่อเพื่อนัดหมายตรวจพื้นที่ อีกครั้ง',
        timestamp: '01/03/11, 11:12 น.',
        isLatest: false,
    },
     {
        id: 'sn06',
        message: 'เอกสารการสมัครเข้าร่วมโครงการฯ ได้รับการอนุมัติแล้ว กรุณารอทางนักส่งเสริมติดต่อเพื่อนัดหมายตรวจพื้นที่ อีกครั้ง',
        timestamp: '01/04/11, 11:12 น.',
        isLatest: false,
    },
];

// =================================================================
// ข้อมูลเกษตรกร (Farmer Data)
// =================================================================
export const plotDetails: PlotDetails = {
    totalArea: '15 ไร่ 2 งาน',
    soilType: 'ดินร่วนปนทราย',
    waterSource: 'บ่อบาดาล และ คลองชลประทาน',
    otherCropsArea: '2 ไร่ (ปลูกมะม่วง)',
    plotBreakdown: [
        'แปลงไผ่กิมซุ่ง: 8 ไร่',
        'แปลงไผ่ตงลืมแล้ง: 5 ไร่ 2 งาน',
        'โรงเพาะชำ: 1 งาน'
    ],
    bambooCount: 2500,
    averageAge: '2 ปี',
};

// =================================================================
// ข้อมูลแอดมิน (Admin Data)
// =================================================================
export const mockAdminNews: AdminNews[] = [
    { id: 'news1', title: 'ประกาศ: ปรับราคาการรับซื้อไผ่รอบใหม่', category: 'ประกาศ', date: '15/07/68' },
    { id: 'news2', title: 'ข่าวสาร: การส่งเสริมการปลูกไผ่เพื่อคาร์บอนเครดิต', category: 'ข่าวสาร', date: '14/07/68' },
    { id: 'news3', title: 'ข่าวสาร: สรุปภาพรวมตลาดไผ่ Q2/2568', category: 'ข่าวสาร', date: '10/07/68' },
];

export const adminUsers: AdminUser[] = [
  { id: 'au001', name: 'สมชาย รักการเกษตร', email: 'somchai.r@example.com', avatarInitials: 'SR', avatarColor: 'bg-green-200', status: UserStatus.ACTIVE, registrationDate: '01/01/68' },
  { id: 'au002', name: 'สมศรี มีสวนไผ่', email: 'somsri.m@example.com', avatarInitials: 'SM', avatarColor: 'bg-blue-200', status: UserStatus.ACTIVE, registrationDate: '15/02/68' },
  { id: 'au003', name: 'มานะ ปลูกไผ่', email: 'mana.p@example.com', avatarInitials: 'MP', avatarColor: 'bg-yellow-200', status: UserStatus.PENDING, registrationDate: '10/07/68' },
  { id: 'au004', name: 'ใจดี ทำไร่', email: 'jaidee.t@example.com', avatarInitials: 'JT', avatarColor: 'bg-red-200', status: UserStatus.INACTIVE, registrationDate: '05/03/67' },
];

export const mockBambooSpecies: BambooSpecies[] = [
    { 
        id: 'bs01', 
        name: 'ไผ่กิมซุ่ง (Kim-sung)', 
        type: 'พันธุ์แท้', 
        harvestAge: '6-8 เดือน (สำหรับหน่อ)',
        avgYield: '3-5 ตัน/ไร่/ปี',
        avgHeight: '10-15 เมตร',
        notableFeatures: 'โตเร็วมาก, ให้หน่อดกตลอดปี, ทนแล้งได้ดี',
        suitability: 'ดินร่วนปนทราย, ดินเหนียวปนทราย, ต้องการแสงแดดจัด'
    },
    { 
        id: 'bs02', 
        name: 'ไผ่ตงลืมแล้ง', 
        type: 'พันธุ์แท้',
        harvestAge: '8-12 เดือน (สำหรับหน่อ)',
        avgYield: '2-3 ตัน/ไร่/ปี',
        avgHeight: '20-25 เมตร',
        notableFeatures: 'หน่อใหญ่ รสชาติดี, ทนทานต่อสภาพอากาศแล้งได้ดีเยี่ยม',
        suitability: 'ทุกสภาพดิน, ทนแล้งได้ดีเป็นพิเศษ'
    },
    { 
        id: 'bs03', 
        name: 'ไผ่ยักษ์น่าน', 
        type: 'พันธุ์แท้',
        harvestAge: '3-5 ปี (สำหรับลำ)',
        avgYield: 'เส้นผ่าศูนย์กลางลำ 20-30 ซม.',
        avgHeight: '30-40 เมตร',
        notableFeatures: 'เป็นไผ่ที่ใหญ่ที่สุดในโลก, ลำตรง, เนื้อไม้หนา แข็งแรง',
        suitability: 'พื้นที่ชุ่มชื้น, ดินร่วน, ต้องการน้ำสม่ำเสมอ'
    },
    { 
        id: 'bs04', 
        name: 'ไผ่หวานเพชรน้ำผึ้ง', 
        type: 'ลูกผสม',
        parentage: 'ไผ่บงหวาน x ไผ่หยก',
        harvestAge: '6 เดือน (สำหรับหน่อ)',
        avgYield: '1.5-2 ตัน/ไร่/ปี',
        avgHeight: '5-7 เมตร',
        notableFeatures: 'หน่อมีรสชาติหวานกรอบ, สามารถทานดิบได้, ไม่มีขนที่หน่อ',
        suitability: 'ดินร่วน, ต้องการการดูแลและการให้น้ำอย่างดี'
    },
];

export const mockEquipment: Equipment[] = [
    { id: 'eq01', name: 'เครื่องสับย่อยกิ่งไผ่', description: 'ใช้สำหรับย่อยกิ่งและลำไผ่เพื่อทำปุ๋ยหมัก', supplier: 'บริษัท เกษตรพัฒนา จำกัด' },
    { id: 'eq02', name: 'เลื่อยยนต์ตัดไผ่', description: 'เลื่อยไฟฟ้ากำลังสูงสำหรับตัดลำไผ่', supplier: 'ร้านสยามอุปกรณ์' },
];

export const mockEnvironmentalData: EnvironmentalData[] = [
    { id: 'ed01', category: 'ปุ๋ย', name: 'ปุ๋ยสูตร 16-16-16', description: 'ปุ๋ยเร่งการเจริญเติบโตสำหรับไผ่อายุ 1-3 ปี' },
    { id: 'ed02', category: 'ใบอนุญาต', name: 'ใบอนุญาตเคลื่อนย้ายไม้', description: 'เอกสารจำเป็นสำหรับการขนส่งไผ่ข้ามจังหวัด' },
];

export const mockMonitoringRequests: MonitoringRequest[] = [
    { id: 'mr01', requesterName: 'สมชาย รักการเกษตร', requestType: 'ตรวจสอบคุณภาพดิน', requestDate: '12/07/68', status: MonitoringRequestStatus.PENDING, assignedTo: null },
    { id: 'mr02', requesterName: 'สมศรี มีสวนไผ่', requestType: 'ประเมินคาร์บอนเครดิต', requestDate: '10/07/68', status: MonitoringRequestStatus.IN_PROGRESS, assignedTo: 'ทีมงาน A' },
    { id: 'mr03', requesterName: 'มานะ ปลูกไผ่', requestType: 'ตรวจสอบโรคพืช', requestDate: '05/07/68', status: MonitoringRequestStatus.COMPLETED, assignedTo: 'ทีมงาน B' },
];

export const mockMonthlyQuotas: MonthlyQuota[] = [
    {
        monthKey: '2568-07',
        monthName: 'กรกฎาคม 2568',
        factoryQuotas: [
            { id: 'fq01', name: 'โรงงานไผ่เจริญ', used: 15, total: 30 },
            { id: 'fq02', name: 'โรงงานไผ่ไทย', used: 10, total: 20 },
        ],
        seedQuota: { used: 5, total: 10 },
        fertilizerQuota: { used: 8, total: 15 },
    },
    {
        monthKey: '2568-08',
        monthName: 'สิงหาคม 2568',
        factoryQuotas: [
            { id: 'fq01', name: 'โรงงานไผ่เจริญ', used: 0, total: 30 },
            { id: 'fq02', name: 'โรงงานไผ่ไทย', used: 0, total: 20 },
        ],
        seedQuota: { used: 0, total: 10 },
        fertilizerQuota: { used: 0, total: 15 },
    }
];

// =================================================================
// ข้อมูลโรงงาน (Factory Data)
// =================================================================
export const mockDailyQuotas = [
    { date: '18/07/68', quota: '50 ตัน' },
    { date: '19/07/68', quota: '40 ตัน' },
    { date: '20/07/68', quota: '60 ตัน' },
];