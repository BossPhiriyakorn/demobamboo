// features/admin/CommunityManagementPage.tsx
// คอมโพเนนต์สำหรับหน้าจัดการระบบชุมชนและความรู้

import React, { useState } from 'react';
import { knowledgeArticles as mockArticles } from '../../data/mockData';
import { KnowledgeArticle, KnowledgeArticleStatus } from '../../types';
import * as Icons from '../../constants';
import ArticleEditorModal from './ArticleEditorModal';

// คอมโพเนนต์สำหรับแสดงแถบสถานะ
const StatusBadge: React.FC<{ status: KnowledgeArticleStatus }> = ({ status }) => {
    const colorClasses = {
        [KnowledgeArticleStatus.PUBLISHED]: { bg: 'bg-green-100', text: 'text-green-800' },
        [KnowledgeArticleStatus.HIDDEN]: { bg: 'bg-gray-100', text: 'text-gray-800' },
    };
    const { bg, text } = colorClasses[status];
    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${bg} ${text}`}>
            {status}
        </span>
    );
};

const CommunityManagementPage: React.FC = () => {
    const [articles, setArticles] = useState<KnowledgeArticle[]>(mockArticles);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<KnowledgeArticle | null>(null);

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newArticles = [...articles];
        const toIndex = direction === 'up' ? index - 1 : index + 1;

        if (toIndex < 0 || toIndex >= newArticles.length) {
            return;
        }

        // Swap elements
        const element = newArticles.splice(index, 1)[0];
        newArticles.splice(toIndex, 0, element);
        
        setArticles(newArticles);
    };

    const handleToggleVisibility = (articleId: string, currentStatus: KnowledgeArticleStatus) => {
        const newStatus = currentStatus === KnowledgeArticleStatus.PUBLISHED ? KnowledgeArticleStatus.HIDDEN : KnowledgeArticleStatus.PUBLISHED;
        setArticles(articles.map(p => p.id === articleId ? { ...p, status: newStatus } : p));
    };
    
    const handleAddClick = () => {
        setEditingArticle(null);
        setIsModalOpen(true);
    };

    const handleEditClick = (article: KnowledgeArticle) => {
        setEditingArticle(article);
        setIsModalOpen(true);
    };
    
    const handleSaveArticle = (formData: Partial<KnowledgeArticle>) => {
        if (editingArticle) {
            // Update existing article
            setArticles(articles.map(p =>
                p.id === editingArticle.id ? { ...p, ...formData } as KnowledgeArticle : p
            ));
        } else {
            // Add new article
            // FIX: Add missing 'category' property
            const newArticle: KnowledgeArticle = {
                id: `k${Date.now()}`,
                title: formData.title || 'ไม่มีชื่อเรื่อง',
                content: formData.content || 'ไม่มีเนื้อหา',
                imageUrl: formData.imageUrl || 'https://source.unsplash.com/400x300/?bamboo,new',
                postDate: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }),
                status: KnowledgeArticleStatus.PUBLISHED, // Default to published
                category: formData.category || 'หมวดหมู่ทั่วไป',
                link: formData.link,
            };
            setArticles([newArticle, ...articles]);
        }
        setIsModalOpen(false);
    };


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-slate-900">จัดการบทความ (คลังความรู้)</h1>

            <div className="bg-[#FFFBEB] border-2 border-black rounded-xl shadow-md p-6">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-900">จัดลำดับและจัดการบทความ</h2>
                     <button onClick={handleAddClick} className="flex items-center space-x-2 bg-[#90EE90] hover:bg-green-500 text-black font-bold py-2 px-4 rounded-lg border border-black transition-colors">
                        <Icons.PlusIcon className="w-5 h-5" />
                        <span>เพิ่มบทความใหม่</span>
                    </button>
                </div>
                

                {/* รายการโพสต์ */}
                <div className="space-y-4">
                    {articles.length > 0 ? articles.map((article, index) => (
                        <div key={article.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                             {/* Reorder Controls */}
                            <div className="flex flex-col items-center justify-center space-y-1">
                                <button 
                                    onClick={() => handleMove(index, 'up')} 
                                    disabled={index === 0} 
                                    className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 hover:text-black"
                                >
                                    <Icons.ChevronUpIcon className="w-6 h-6" />
                                </button>
                                <span className="font-bold text-slate-700 select-none">{index + 1}</span>
                                <button 
                                    onClick={() => handleMove(index, 'down')} 
                                    disabled={index === articles.length - 1} 
                                    className="p-1 rounded-full hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-600 hover:text-black"
                                >
                                    <Icons.ChevronDownIcon className="w-6 h-6" />
                                </button>
                            </div>
                            
                            <div className="w-px bg-gray-200 self-stretch"></div>

                            {/* Image */}
                             <img src={article.imageUrl} alt={article.title} className="w-24 h-24 md:w-32 md:h-24 object-cover rounded-md flex-shrink-0" />

                            {/* Post Content */}
                            <div className="flex-grow">
                                <h3 className="font-semibold text-lg text-slate-800 mb-1">{article.title}</h3>
                                <p className="text-sm text-slate-500 mb-2">เผยแพร่: {article.postDate}</p>
                                 <div className="flex items-center space-x-4 text-sm text-slate-600">
                                    <StatusBadge status={article.status} />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex-shrink-0 flex flex-col items-center justify-start gap-2 self-start">
                                <button onClick={() => handleToggleVisibility(article.id, article.status)} className="text-sm w-24 text-center font-semibold text-white py-1 px-3 rounded-md transition-colors bg-orange-500 hover:bg-orange-600">
                                    {article.status === KnowledgeArticleStatus.PUBLISHED ? 'ซ่อน' : 'แสดง'}
                                </button>
                                <button onClick={() => handleEditClick(article)} className="text-sm w-24 text-center font-semibold text-black py-1 px-3 rounded-md transition-colors bg-amber-300 hover:bg-amber-400">แก้ไข</button>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-10 text-slate-500">
                            ไม่มีบทความ
                        </div>
                    )}
                </div>
            </div>
            
            <ArticleEditorModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveArticle}
                article={editingArticle}
            />
        </div>
    );
};

export default CommunityManagementPage;