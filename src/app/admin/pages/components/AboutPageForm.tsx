"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Loader2, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { AboutPageData } from '@/types';

const INITIAL: AboutPageData = {
    history: { tr: '', en: '' },
    vision: { tr: '', en: '' },
    mission: { tr: [], en: [] },
};

export default function AboutPageForm() {
    const [data, setData] = useState<AboutPageData>(INITIAL);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/pages/about')
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
            const res = await fetch('/api/pages/about', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Kaydedilemedi');
            setSuccess('Hakkımızda sayfası güncellendi!');
        } catch (err) {
            setError('Bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    }

    /* Helper to update nested fields safely */
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

    // Mission items handling
    const addMissionItem = (lang: 'tr' | 'en') => {
        setData(prev => {
            const list = prev.mission[lang] || [];
            return update(prev, ['mission', lang], [...list, '']);
        });
    };

    const updateMissionItem = (lang: 'tr' | 'en', index: number, val: string) => {
        setData(prev => {
            const list = [...prev.mission[lang]];
            list[index] = val;
            return update(prev, ['mission', lang], list);
        });
    };

    const removeMissionItem = (lang: 'tr' | 'en', index: number) => {
        setData(prev => {
            const list = prev.mission[lang].filter((_, i) => i !== index);
            return update(prev, ['mission', lang], list);
        });
    };

    if (loading) return <div className="text-gray-500 dark:text-gray-400">Yükleniyor...</div>;

    return (
        <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-500">
            {success && <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-2 border border-green-200 dark:border-green-800"><CheckCircle2 className="w-4 h-4" /> {success}</div>}
            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2 border border-red-200 dark:border-red-800"><AlertCircle className="w-4 h-4" /> {error}</div>}

            {/* History */}
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Tarihçe</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Tarihçe (TR)</label>
                        <textarea rows={5} value={data.history?.tr || ''} onChange={e => handleUpdate(['history', 'tr'], e.target.value)} className="w-full mt-1 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Tarihçe (EN)</label>
                        <textarea rows={5} value={data.history?.en || ''} onChange={e => handleUpdate(['history', 'en'], e.target.value)} className="w-full mt-1 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                </div>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Vizyon</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Vizyon (TR)</label>
                        <textarea rows={3} value={data.vision?.tr || ''} onChange={e => handleUpdate(['vision', 'tr'], e.target.value)} className="w-full mt-1 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Vizyon (EN)</label>
                        <textarea rows={3} value={data.vision?.en || ''} onChange={e => handleUpdate(['vision', 'en'], e.target.value)} className="w-full mt-1 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                </div>
            </div>

            {/* Mission (Lists) */}
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Misyon (Maddeler Halinde)</h3>
                <div className="grid grid-cols-2 gap-8">
                    {/* TR */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Maddeler (TR)</label>
                            <button type="button" onClick={() => addMissionItem('tr')} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Ekle</button>
                        </div>
                        {data.mission?.tr?.map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input type="text" value={item} onChange={e => updateMissionItem('tr', idx, e.target.value)} className="flex-1 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                <button type="button" onClick={() => removeMissionItem('tr', idx)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                    {/* EN */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">Maddeler (EN)</label>
                            <button type="button" onClick={() => addMissionItem('en')} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1"><Plus className="w-3 h-3" /> Ekle</button>
                        </div>
                        {data.mission?.en?.map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                                <input type="text" value={item} onChange={e => updateMissionItem('en', idx, e.target.value)} className="flex-1 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                <button type="button" onClick={() => removeMissionItem('en', idx)} className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 sticky bottom-4 z-10">
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-lg shadow-orange-500/20">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Kaydet
                </button>
            </div>
        </form>
    );
}
