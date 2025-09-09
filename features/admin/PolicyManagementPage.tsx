// features/admin/PolicyManagementPage.tsx
// หน้าสำหรับแอดมินเพื่อจัดการเนื้อหานโยบายและข้อตกลง

import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import * as Icons from '../../constants';

interface PolicyManagementPageProps {
    policyContent: string;
    termsContent: string;
    onSave: (newPolicy: string, newTerms: string) => void;
}

const PolicyManagementPage: React.FC<PolicyManagementPageProps> = ({ policyContent, termsContent, onSave }) => {
    // ใช้ State ภายในสำหรับจัดการการแก้ไขใน Textarea
    const [localPolicy, setLocalPolicy] = useState(policyContent);
    const [localTerms, setLocalTerms] = useState(termsContent);
    
    // อัปเดต State ภายในเมื่อ props จากข้างนอกเปลี่ยนแปลง
    useEffect(() => {
        setLocalPolicy(policyContent);
        setLocalTerms(termsContent);
    }, [policyContent, termsContent]);

    const handleSave = () => {
        // เมื่อกดบันทึก, เรียกใช้ฟังก์ชัน onSave ที่ได้รับมาจาก props
        // เพื่ออัปเดต State ที่ศูนย์กลาง (App.tsx)
        onSave(localPolicy, localTerms);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-900">จัดการนโยบายและข้อตกลง</h1>
                 <button 
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-[#54B948] hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-colors"
                >
                    <Icons.CheckIcon className="w-5 h-5" />
                    <span>บันทึกการเปลี่ยนแปลง</span>
                </button>
            </div>
            
             <p className="text-slate-600">
                แก้ไขเนื้อหาของนโยบายความเป็นส่วนบุคคลและข้อตกลงการใช้งานที่แสดงในหน้าลงทะเบียนของเกษตรกรได้ที่นี่
             </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Editor for Privacy Policy */}
                <Card className="bg-white">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">นโยบายความเป็นส่วนบุคคล</h2>
                    <textarea
                        value={localPolicy}
                        onChange={(e) => setLocalPolicy(e.target.value)}
                        className="w-full h-96 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition font-mono text-sm"
                        placeholder="ใส่เนื้อหานโยบายที่นี่..."
                    />
                </Card>

                {/* Editor for Terms and Conditions */}
                <Card className="bg-white">
                    <h2 className="text-xl font-bold text-slate-900 mb-4">เงื่อนไขและข้อตกลง</h2>
                    <textarea
                        value={localTerms}
                        onChange={(e) => setLocalTerms(e.target.value)}
                        className="w-full h-96 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition font-mono text-sm"
                        placeholder="ใส่เนื้อหาข้อตกลงที่นี่..."
                    />
                </Card>
            </div>
        </div>
    );
};

export default PolicyManagementPage;