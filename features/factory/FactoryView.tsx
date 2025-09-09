// features/factory/FactoryView.tsx
// คอมโพเนนต์หลักสำหรับมุมมองของโรงงาน (Factory)

import React from 'react';
import FactoryLayout from './FactoryLayout';


// Props ที่คอมโพเนนต์นี้ต้องการ
interface FactoryViewProps {
    onLogout: () => void; // ฟังก์ชันสำหรับ Logout
}

const FactoryView: React.FC<FactoryViewProps> = ({ onLogout }) => {
    return (
        <FactoryLayout onLogout={onLogout} />
    );
};

export default FactoryView;