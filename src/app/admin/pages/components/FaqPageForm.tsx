"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Loader2, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { FaqPageData } from '@/types';

const INITIAL: FaqPageData = {
    faqs: []
};

export default function FaqPageForm() {
    const [data, setData] = useState<FaqPageData>(INITIAL);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/pages/faq')
            .then(r => r.json())
            .then(j => setData(j.data || INITIAL))
            .catch(() => setError('Veri yüklenemedi'))
            .finally(() => setLoading(false));
    }, []);

    async function handleSave(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        setSuccess('');
        setError('');
        try {
            const res = await fetch('/api/pages/faq', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Kaydedilemedi');
            setSuccess('SSS sayfası güncellendi!');
        } catch (err) {
            setError('Bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    }

    const addItem = () => {
        setData(prev => ({
            ...prev,
            faqs: [...(prev.faqs || []), { question: { tr: '', en: '' }, answer: { tr: '', en: '' } }]
        }));
    };

    const removeItem = (index: number) => {
        setData(prev => ({
            ...prev,
            faqs: prev.faqs.filter((_, i) => i !== index)
        }));
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update = (obj: any, path: string[], value: any) => {
        const newObj = JSON.parse(JSON.stringify(obj));
        let curr = newObj;
        for (let i = 0; i < path.length - 1; i++) curr = curr[path[i]];
        curr[path[path.length - 1]] = value;
        return newObj;
    };

    const handleUpdate = (path: string[], value: string) => {
        setData(prev => update(prev, path, value));
    };

    if (loading) return <div className="text-gray-500 dark:text-gray-400">Yükleniyor...</div>;

    return (
        <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-500">
            {success && <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-2 border border-green-200 dark:border-green-800"><CheckCircle2 className="w-4 h-4" /> {success}</div>}
            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2 border border-red-200 dark:border-red-800"><AlertCircle className="w-4 h-4" /> {error}</div>}

            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Sıkça Sorulan Sorular</h3>
                    <button type="button" onClick={addItem} className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                        <Plus className="w-3 h-3" /> Soru Ekle
                    </button>
                </div>

                {data.faqs?.map((faq, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-neutral-900/30 rounded-lg relative group border border-gray-100 dark:border-gray-800">
                        <button type="button" onClick={() => removeItem(idx)} className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="grid grid-cols-2 gap-6">
                            {/* TR */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Türkçe</label>
                                <input type="text" placeholder="Soru (TR)" value={faq.question?.tr || ''} onChange={e => handleUpdate(['faqs', idx.toString(), 'question', 'tr'], e.target.value)} className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                <textarea rows={4} placeholder="Cevap (TR)" value={faq.answer?.tr || ''} onChange={e => handleUpdate(['faqs', idx.toString(), 'answer', 'tr'], e.target.value)} className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                            {/* EN */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">İngilizce</label>
                                <input type="text" placeholder="Soru (EN)" value={faq.question?.en || ''} onChange={e => handleUpdate(['faqs', idx.toString(), 'question', 'en'], e.target.value)} className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                <textarea rows={4} placeholder="Cevap (EN)" value={faq.answer?.en || ''} onChange={e => handleUpdate(['faqs', idx.toString(), 'answer', 'en'], e.target.value)} className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                            </div>
                        </div>
                    </div>
                ))}

                {(!data.faqs || data.faqs.length === 0) && <p className="text-sm text-gray-400 text-center py-8">Henüz soru eklenmemiş.</p>}
            </div>

            <div className="flex justify-end pt-4 sticky bottom-4 z-10">
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-lg shadow-orange-500/20">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Kaydet
                </button>
            </div>
        </form>
    );
}
