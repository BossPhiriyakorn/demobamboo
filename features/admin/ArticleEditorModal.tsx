// features/admin/ArticleEditorModal.tsx
import React, { useState, useRef, useEffect } from 'react';
import { KnowledgeArticle } from '../../types';
import * as Icons from '../../constants';

interface ArticleEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (articleData: Partial<KnowledgeArticle>) => void;
    article: KnowledgeArticle | null;
}

const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({ isOpen, onClose, onSave, article }) => {
    const [formData, setFormData] = useState<Partial<KnowledgeArticle>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const defaultImageUrl = 'https://source.unsplash.com/400x300/?bamboo,article';

    useEffect(() => {
        if (isOpen) {
            setFormData(article || {
                title: '',
                content: '',
                link: '',
                imageUrl: defaultImageUrl,
                category: '',
            });
        }
    }, [article, isOpen]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, imageUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!isOpen) return null;

    const InputField: React.FC<{label: string, name: keyof KnowledgeArticle, value: string | undefined, placeholder?: string, isTextarea?: boolean, required?: boolean}> = ({label, name, value, placeholder, isTextarea = false, required = true}) => (
        <div>
            <label htmlFor={name} className="block text-sm font-bold text-slate-700 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
            {isTextarea ? (
                <textarea id={name} name={name} value={value || ''} onChange={handleChange} rows={5} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" placeholder={placeholder} required={required} />
            ) : (
                <input type="text" id={name} name={name} value={value || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition" placeholder={placeholder} required={required}/>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onClose}>
            <div className="bg-white rounded-xl border-2 border-black shadow-2xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSave}>
                    <h3 className="text-2xl font-bold mb-6 text-center text-slate-900">
                        {article ? 'แก้ไขบทความ' : 'เพิ่มบทความใหม่'}
                    </h3>
                    
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative w-full h-48 bg-gray-100 rounded-lg">
                            <img src={formData.imageUrl || defaultImageUrl} alt="Article Preview" className="w-full h-full rounded-lg object-cover border-2 border-gray-200" />
                            <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 bg-black/60 text-white p-2 rounded-full hover:bg-black transition" aria-label="เปลี่ยนรูปภาพ">
                                <Icons.PencilIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                    </div>

                    <div className="space-y-4">
                        <InputField label="หัวข้อบทความ" name="title" value={formData.title} placeholder="ใส่หัวข้อที่น่าสนใจ" />
                        {/* FIX: Add category input field */}
                        <InputField label="หมวดหมู่" name="category" value={formData.category} placeholder="เช่น การดูแลรักษา" />
                        <InputField label="เนื้อหาบทความ" name="content" value={formData.content} placeholder="ใส่เนื้อหาของบทความ" isTextarea={true} />
                        <InputField label="ลิงก์เพิ่มเติม" name="link" value={formData.link} placeholder="https://example.com (ไม่บังคับ)" required={false} />
                    </div>

                    <div className="flex justify-end items-center mt-8 space-x-4">
                        <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black font-bold py-2 px-6 rounded-lg border border-black transition-all">ยกเลิก</button>
                        <button type="submit" className="bg-[#90EE90] hover:bg-green-500 text-black font-bold py-2 px-6 rounded-lg border border-black transition-all">บันทึก</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ArticleEditorModal;