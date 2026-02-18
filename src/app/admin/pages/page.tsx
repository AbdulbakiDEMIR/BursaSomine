"use client";

import { useState } from 'react';
import HomePageForm from './components/HomePageForm';
import AboutPageForm from './components/AboutPageForm';
import FaqPageForm from './components/FaqPageForm';

const TABS = [
    { id: 'home', label: 'Ana Sayfa' },
    { id: 'about', label: 'Hakkımızda' },
    { id: 'faq', label: 'Sıkça Sorulan Sorular' },
];

export default function AdminPagesPage() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <div className="p-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sayfa İçerikleri</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Site sayfalarının metin ve görsellerini yönetin</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-gray-200 dark:border-gray-800 pb-1">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 text-sm font-medium transition-colors relative top-[1px] ${activeTab === tab.id
                                ? 'border-b-2 border-orange-500 text-orange-600 dark:text-orange-400'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 rounded-t-lg'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div>
                {activeTab === 'home' && <HomePageForm />}
                {activeTab === 'about' && <AboutPageForm />}
                {activeTab === 'faq' && <FaqPageForm />}
            </div>
        </div>
    );
}
