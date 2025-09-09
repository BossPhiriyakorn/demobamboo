// features/admin/MasterDataPage.tsx
// คอมโพเนนต์สำหรับหน้าจัดการข้อมูลหลัก (Master Data)

import React, { useState, useEffect } from 'react';
import { BambooSpecies, Equipment, EnvironmentalData } from '../../types';
import * as mockData from '../../data/mockData';
import * as Icons from '../../constants';
import ConfirmationModal from '../../components/ConfirmationModal';

// Type definitions
type MasterDataTab = 'species' | 'equipment' | 'environment';
type DataItem = BambooSpecies | Equipment | EnvironmentalData;
type Setter<T> = React.Dispatch<React.SetStateAction<T[]>>;

interface FieldConfig {
    name: keyof (BambooSpecies & Equipment & EnvironmentalData);
    label: string;
    type: 'text' | 'textarea' | 'select';
    options?: string[];
    required?: boolean;
}

// Props for the page
interface MasterDataPageProps {
    activeTab: MasterDataTab;
}

// Data Entry Modal Component (Light Theme)
const DataEntryModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (item: any) => void;
    item: DataItem | null;
    fields: FieldConfig[];
    title: string;
}> = ({ isOpen, onClose, onSave, item, fields, title }) => {
    const [formData, setFormData] = useState<any>(item || {});

    useEffect(() => {
        if (isOpen) {
            const initialData = item || fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {});
            // Set default for select if it's a new item
            if (!item) {
                const selectField = fields.find(f => f.type === 'select');
                if (selectField && selectField.options) {
                    initialData[selectField.name] = initialData[selectField.name] || selectField.options[0];
                }
            }
            setFormData(initialData);
        }
    }, [isOpen, item, fields]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const inputClasses = "mt-1 block w-full rounded-md bg-white border-gray-300 text-slate-900 shadow-sm focus:border-amber-400 focus:ring-amber-400 focus:ring-opacity-50 sm:text-sm";

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl border-2 border-black shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <h3 className="text-xl font-bold mb-6 text-slate-900">{title}</h3>
                    <div className="space-y-4">
                        {fields.map(field => {
                            if (field.name === 'parentage' && formData.type !== 'ลูกผสม') {
                                return null;
                            }
                            return (
                                <div key={field.name}>
                                    <label htmlFor={field.name} className="block text-sm font-medium text-slate-700">{field.label}</label>
                                    {field.type === 'textarea' ? (
                                        <textarea name={field.name} id={field.name} value={formData[field.name] || ''} onChange={handleChange} rows={3} className={inputClasses} required={field.required !== false} />
                                    ) : field.type === 'select' ? (
                                        <select name={field.name} id={field.name} value={formData[field.name] || ''} onChange={handleChange} className={inputClasses} required={field.required !== false}>
                                            <option value="" disabled>เลือก...</option>
                                            {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" name={field.name} id={field.name} value={formData[field.name] || ''} onChange={handleChange} className={inputClasses} required={field.required !== false} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex justify-end space-x-4 mt-8">
                        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded-lg border border-black transition-colors">ยกเลิก</button>
                        <button type="submit" className="bg-[#90EE90] hover:bg-green-500 text-black font-bold py-2 px-6 rounded-lg border border-black transition-colors">บันทึก</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const MasterDataPage: React.FC<MasterDataPageProps> = ({ activeTab }) => {
    // State management
    const [species, setSpecies] = useState<BambooSpecies[]>(mockData.mockBambooSpecies);
    const [equipments, setEquipments] = useState<Equipment[]>(mockData.mockEquipment);
    const [envData, setEnvData] = useState<EnvironmentalData[]>(mockData.mockEnvironmentalData);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<DataItem | null>(null);

    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<DataItem | null>(null);

    // Dynamic content based on active tab
    const tabConfig: Record<MasterDataTab, { title: string; data: DataItem[]; setData: Setter<any>; headers: string[]; fields: FieldConfig[]; renderRow: (item: any) => JSX.Element; }> = {
        species: {
            title: 'ฐานข้อมูลสายพันธุ์ไผ่',
            data: species,
            setData: setSpecies,
            headers: ['ชื่อสายพันธุ์', 'ประเภท', 'อายุเก็บเกี่ยว', 'ผลผลิตเฉลี่ย', 'ลักษณะเด่น', ''],
            fields: [
                { name: 'name', label: 'ชื่อสายพันธุ์', type: 'text' },
                { name: 'type', label: 'ประเภท', type: 'select', options: ['พันธุ์แท้', 'ลูกผสม'] },
                { name: 'parentage', label: 'เชื้อสาย (ถ้าเป็นลูกผสม)', type: 'text', required: false },
                { name: 'harvestAge', label: 'อายุเก็บเกี่ยว', type: 'text' },
                { name: 'avgYield', label: 'ผลผลิตเฉลี่ย', type: 'text' },
                { name: 'avgHeight', label: 'ความสูงเฉลี่ย', type: 'text' },
                { name: 'notableFeatures', label: 'ลักษณะเด่น', type: 'textarea' },
                { name: 'suitability', label: 'ความเหมาะสมของพื้นที่', type: 'textarea' },
            ],
            renderRow: (item: BambooSpecies) => (
                <>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{item.name}</div>
                        {item.type === 'ลูกผสม' && <div className="text-xs text-slate-500">{item.parentage}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{item.harvestAge}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{item.avgYield}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-slate-700 max-w-xs truncate" title={item.notableFeatures}>{item.notableFeatures}</td>
                </>
            )
        },
        equipment: {
            title: 'จัดการข้อมูลอุปกรณ์',
            data: equipments,
            setData: setEquipments,
            headers: ['ชื่ออุปกรณ์', 'คำอธิบาย', 'ผู้จัดจำหน่าย', ''],
            fields: [
                { name: 'name', label: 'ชื่ออุปกรณ์', type: 'text' },
                { name: 'description', label: 'คำอธิบาย', type: 'textarea' },
                { name: 'supplier', label: 'ผู้จัดจำหน่าย', type: 'text' },
            ],
             renderRow: (item: Equipment) => (
                <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.name}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-slate-700">{item.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{item.supplier}</td>
                </>
            )
        },
        environment: {
            title: 'จัดการข้อมูลสิ่งแวดล้อม',
            data: envData,
            setData: setEnvData,
            headers: ['หมวดหมู่', 'ชื่อ', 'คำอธิบาย', ''],
            fields: [
                 { name: 'category', label: 'หมวดหมู่', type: 'select', options: ['ปุ๋ย', 'ใบอนุญาต'] },
                 { name: 'name', label: 'ชื่อ', type: 'text' },
                 { name: 'description', label: 'คำอธิบาย', type: 'textarea' },
            ],
            renderRow: (item: EnvironmentalData) => (
                <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{item.name}</td>
                    <td className="px-6 py-4 whitespace-normal text-sm text-slate-700">{item.description}</td>
                </>
            )
        }
    };
    
    const currentConfig = tabConfig[activeTab];

    // Handlers
    const handleAdd = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEdit = (item: DataItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (item: DataItem) => {
        setItemToDelete(item);
        setConfirmModalOpen(true);
    };

    const handleAnalyze = (item: DataItem) => {
        alert(`แสดงการวิเคราะห์สำหรับ '${(item as BambooSpecies).name}'.\n(ฟีเจอร์นี้กำลังอยู่ในระหว่างการพัฒนา)`);
    };

    const confirmDelete = () => {
        if (!itemToDelete) return;
        currentConfig.setData(currentConfig.data.filter(d => d.id !== itemToDelete.id));
        setConfirmModalOpen(false);
        setItemToDelete(null);
    };

    const handleSave = (item: DataItem) => {
        if (editingItem) {
            // Update
            currentConfig.setData(currentConfig.data.map(d => d.id === editingItem.id ? { ...d, ...item } : d));
        } else {
            // Add new
            const newItem = { ...item, id: `${activeTab}-${Date.now()}` };
            currentConfig.setData([...currentConfig.data, newItem]);
        }
        setIsModalOpen(false);
    };

    // JSX
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">การจัดการข้อมูลหลัก</h1>

            {/* Content */}
            <div className="bg-[#FFFBEB] border-2 border-black rounded-xl shadow-md p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">{currentConfig.title}</h2>
                    <button
                        onClick={handleAdd}
                        className="flex items-center space-x-2 bg-[#90EE90] hover:bg-green-500 text-black font-bold py-2 px-4 rounded-lg border border-black transition-colors"
                    >
                        <Icons.PlusIcon className="w-5 h-5" />
                        <span>เพิ่มข้อมูลใหม่</span>
                    </button>
                 </div>
                 
                 {/* Table */}
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-amber-50">
                            <tr>
                                {currentConfig.headers.map(header => (
                                    <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-[#FFFBEB] divide-y divide-gray-200">
                            {currentConfig.data.length > 0 ? currentConfig.data.map((item) => (
                                <tr key={item.id} className="hover:bg-amber-100/50 transition-colors">
                                    {currentConfig.renderRow(item as any)}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-1">
                                            {activeTab === 'species' && (
                                                <button onClick={() => handleAnalyze(item)} className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100" title="วิเคราะห์ประสิทธิภาพ">
                                                    <Icons.ChartBarIcon className="w-5 h-5"/>
                                                </button>
                                            )}
                                            <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100" title="แก้ไข">
                                                <Icons.PencilIcon className="w-5 h-5"/>
                                            </button>
                                            <button onClick={() => handleDelete(item)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100" title="ลบ">
                                                <Icons.TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={currentConfig.headers.length} className="text-center py-10 text-slate-500">
                                        ไม่มีข้อมูล
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>

            {/* Add/Edit Modal */}
            <DataEntryModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                item={editingItem}
                fields={currentConfig.fields}
                title={editingItem ? `แก้ไขข้อมูล` : `เพิ่มข้อมูลใหม่`}
            />
            
            {/* Confirmation Modal */}
            {isConfirmModalOpen && (
                 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl border-2 border-black shadow-2xl p-8 max-w-sm w-full text-center">
                        <h3 className="text-xl font-bold mb-2 text-slate-900">ยืนยันการลบ</h3>
                        <p className="text-slate-800 mb-6">คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้? การกระทำนี้ไม่สามารถย้อนกลับได้</p>
                        <div className="flex justify-center space-x-4">
                            <button onClick={confirmDelete} className="bg-[#F08080] hover:bg-red-500 text-black font-bold py-2 px-8 rounded-lg border border-black transition-all">ยืนยัน</button>
                            <button onClick={() => setConfirmModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-8 rounded-lg border border-black transition-all">ยกเลิก</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MasterDataPage;