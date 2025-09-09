// components/TopHeader.tsx
import React from 'react';
import * as Icons from '../constants';

const TopHeader = () => {
    return (
        <header className="h-20 bg-white border-b border-slate-200 flex-shrink-0 flex items-center justify-end px-6 space-x-4">
            <div className="relative w-full max-w-xs">
                <input
                    type="search"
                    placeholder="Search for something..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 border border-transparent focus:bg-white focus:border-slate-300 focus:ring-0 transition"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
            </div>
            <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
             <button className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full relative">
                <Icons.BellIcon className="h-6 w-6"/>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
        </header>
    );
};

export default TopHeader;