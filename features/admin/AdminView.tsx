// features/admin/AdminView.tsx
// คอมโพเนนต์หลักสำหรับมุมมองของผู้ดูแลระบบ (Admin)

import React from 'react';
import AdminLayout from './AdminLayout';

// Props ที่คอมโพเนนต์นี้ต้องการ
interface AdminViewProps {
    onLogout: () => void;
    policyContent: string;
    termsContent: string;
    onUpdatePolicies: (newPolicy: string, newTerms: string) => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onLogout, policyContent, termsContent, onUpdatePolicies }) => {
    return (
        <AdminLayout 
            onLogout={onLogout}
            policyContent={policyContent}
            termsContent={termsContent}
            onUpdatePolicies={onUpdatePolicies}
        />
    );
};

export default AdminView;