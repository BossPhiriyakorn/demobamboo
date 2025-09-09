// features/farmer/ProfileEditModal.tsx
// คอมโพเนนต์หน้าต่าง (Modal) สำหรับแก้ไขข้อมูลโปรไฟล์ (ใหม่)

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Profile } from '../../types';
import * as Icons from '../../constants';
import SearchableSelect from '../../components/SearchableSelect';
import { thailandAddressData } from '../../data/thailandAddressData';

// Props
interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: Profile;
    onSave: (updatedProfile: Profile) => void;
}

// Helper InputField component
const InputField: React.FC<{
    label: string;
    name: string;
    value: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    placeholder?: string;
}> = ({ label, name, value, onChange, type = 'text', required = true, disabled = false, placeholder }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-bold text-slate-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
        <input type={type} id={name} name={name} value={value} onChange={onChange} className={`w-full p-2 border border-gray-300 bg-gray-50 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition text-black ${disabled ? 'bg-gray-200 cursor-not-allowed text-slate-500' : 'text-black'} placeholder:text-slate-500 placeholder:font-normal`} required={required} disabled={disabled} placeholder={placeholder}/>
    </div>
);


const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, profile, onSave }) => {
    // State for form data
    const [formData, setFormData] = useState({
        ...profile
    });
    
    // Address dropdown options
    const provinceOptions = Object.keys(thailandAddressData).map(p => ({ value: p, label: p }));
    const [districtOptions, setDistrictOptions] = useState<{value: string, label: string}[]>([]);
    const [subdistrictOptions, setSubdistrictOptions] = useState<{value: string, label: string}[]>([]);

    useEffect(() => {
      if (isOpen) {
        setFormData(profile); // Reset form data when modal opens/profile changes
      }
    }, [profile, isOpen]);

    // Update district options when province changes
    useEffect(() => {
        if (formData.address.province) {
            const districts = Object.keys(thailandAddressData[formData.address.province] || {});
            setDistrictOptions(districts.map(d => ({ value: d, label: d })));
        } else {
            setDistrictOptions([]);
        }
        setSubdistrictOptions([]);
    }, [formData.address.province]);

    // Update subdistrict options when district changes
    useEffect(() => {
        if (formData.address.province && formData.address.district) {
            const subdistricts = Object.keys(thailandAddressData[formData.address.province]?.[formData.address.district] || {});
            setSubdistrictOptions(subdistricts.map(s => ({ value: s, label: s })));
        } else {
            setSubdistrictOptions([]);
        }
    }, [formData.address.district, formData.address.province]);

    // Update postal code when subdistrict changes
    useEffect(() => {
        if (formData.address.province && formData.address.district && formData.address.subdistrict) {
            const postalCode = thailandAddressData[formData.address.province]?.[formData.address.district]?.[formData.address.subdistrict] || '';
            setFormData(prev => ({ ...prev, address: {...prev.address, postalCode} }));
        } else {
             setFormData(prev => ({ ...prev, address: {...prev.address, postalCode: ''} }));
        }
    }, [formData.address.subdistrict, formData.address.district, formData.address.province]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name in formData.address) {
            setFormData(prev => ({ ...prev, address: { ...prev.address, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleAddressChange = (field: 'province' | 'district' | 'subdistrict', value: string) => {
        setFormData(prev => {
            const newAddress = { ...prev.address, [field]: value };
            if (field === 'province') {
                newAddress.district = '';
                newAddress.subdistrict = '';
                newAddress.postalCode = '';
            }
            if (field === 'district') {
                newAddress.subdistrict = '';
                newAddress.postalCode = '';
            }
            return { ...prev, address: newAddress };
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
                        <Icons.ChevronLeftIcon className="w-6 h-6 text-slate-700"/>
                    </button>
                    <h3 className="text-xl font-bold text-center text-slate-900">แก้ไขโปรไฟล์</h3>
                    <div className="w-10"></div> {/* Spacer */}
                </div>
                
                {/* Form Content */}
                <form onSubmit={handleSave} className="p-6 md:p-8 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <InputField label="ชื่อ" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="กรอกชื่อ" />
                        <InputField label="นามสกุล" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="กรอกนามสกุล" />
                        <div className="md:col-span-2">
                            <InputField label="เบอร์โทร" name="phone" value={formData.phone} onChange={handleChange} placeholder="กรอกเบอร์โทร" />
                        </div>
                        <div className="md:col-span-2">
                            <InputField label="อีเมล" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="กรอกอีเมล" required={false} />
                        </div>
                        <div className="md:col-span-2">
                             <InputField label="Line ID" name="lineId" value={formData.lineId} onChange={handleChange} placeholder="กรอก Line ID" required={false} />
                        </div>
                        
                        <h3 className="md:col-span-2 text-md font-bold text-slate-800 pt-2 border-b border-gray-200 pb-1 mt-2">ที่อยู่*</h3>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">จังหวัด <span className="text-red-500">*</span></label>
                            <SearchableSelect options={provinceOptions} value={formData.address.province} onChange={val => handleAddressChange('province', val)} placeholder="เลือกจังหวัด" />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">อำเภอ/เขต <span className="text-red-500">*</span></label>
                            <SearchableSelect options={districtOptions} value={formData.address.district} onChange={val => handleAddressChange('district', val)} placeholder="เลือกอำเภอ" disabled={!formData.address.province} />
                        </div>
                         <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">ตำบล/แขวง <span className="text-red-500">*</span></label>
                            <SearchableSelect options={subdistrictOptions} value={formData.address.subdistrict} onChange={val => handleAddressChange('subdistrict', val)} placeholder="เลือกตำบล" disabled={!formData.address.district} />
                        </div>

                        <InputField label="รหัสไปรษณีย์" name="postalCode" value={formData.address.postalCode} onChange={handleChange} placeholder="จะแสดงอัตโนมัติ" disabled={true} />
                        <InputField label="ถนน" name="street" value={formData.address.street} onChange={handleChange} placeholder=" (ถ้ามี)" required={false} />
                        <InputField label="ซอย" name="soi" value={formData.address.soi} onChange={handleChange} placeholder=" (ถ้ามี)" required={false} />
                        <InputField label="หมู่ที่" name="moo" value={formData.address.moo} onChange={handleChange} placeholder=" (ถ้ามี)" required={false} />
                    </div>

                     {/* Footer with Save Button */}
                    <div className="pt-6 mt-4 border-t border-gray-200">
                        <button type="submit" className="w-full bg-[#54B948] hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors text-lg">
                            บันทึก
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;