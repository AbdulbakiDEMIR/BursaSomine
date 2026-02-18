"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Loader2, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { HomePageData } from '@/types';

const INITIAL: HomePageData = {
    hero: { title: { tr: '', en: '' }, subtitle: { tr: '', en: '' }, ctaText: { tr: '', en: '' } },
    stats: {
        yearsLabel: { tr: '', en: '' }, yearsValue: 0,
        projectsLabel: { tr: '', en: '' }, projectsValue: 0,
        satisfactionLabel: { tr: '', en: '' }, satisfactionValue: 0,
        citiesLabel: { tr: '', en: '' }, citiesValue: 0,
    },
    features: []
};

// Helper component for bilingual inputs
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BilingualInput = ({ label, valueTr, valueEn, onChangeTr, onChangeEn, placeholderTr, placeholderEn }: any) => (
    <div className="space-y-2">
        <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</label>
        <div className="grid grid-cols-1 gap-2">
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">TR</span>
                <input
                    type="text"
                    value={valueTr}
                    onChange={e => onChangeTr(e.target.value)}
                    placeholder={placeholderTr}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-orange-50/30 dark:bg-orange-900/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600"
                />
            </div>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">EN</span>
                <input
                    type="text"
                    value={valueEn}
                    onChange={e => onChangeEn(e.target.value)}
                    placeholder={placeholderEn}
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50/30 dark:bg-blue-900/10 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600"
                />
            </div>
        </div>
    </div>
);

export default function HomePageForm() {
    const [data, setData] = useState<HomePageData>(INITIAL);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/pages/home')
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
            const res = await fetch('/api/pages/home', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Kaydedilemedi');
            setSuccess('Ana sayfa güncellendi!');
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

    const handleUpdate = (path: string[], value: string | number) => {
        setData(prev => update(prev, path, value));
    };

    const addFeature = () => {
        setData(prev => ({
            ...prev,
            features: [...(prev.features || []), { title: { tr: '', en: '' }, description: { tr: '', en: '' } }]
        }));
    };

    const removeFeature = (index: number) => {
        setData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    if (loading) return <div className="text-gray-500 dark:text-gray-400">Yükleniyor...</div>;

    return (
        <form onSubmit={handleSave} className="space-y-8 animate-in fade-in duration-500">
            {success && <div className="p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-2 border border-green-200 dark:border-green-800"><CheckCircle2 className="w-4 h-4" /> {success}</div>}
            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg flex items-center gap-2 border border-red-200 dark:border-red-800"><AlertCircle className="w-4 h-4" /> {error}</div>}

            {/* HERO SECTION */}
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Hero Alanı</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <BilingualInput label="Başlık"
                        valueTr={data.hero?.title?.tr || ''} onChangeTr={(v: string) => handleUpdate(['hero', 'title', 'tr'], v)}
                        valueEn={data.hero?.title?.en || ''} onChangeEn={(v: string) => handleUpdate(['hero', 'title', 'en'], v)}
                    />
                    <BilingualInput label="Alt Başlık"
                        valueTr={data.hero?.subtitle?.tr || ''} onChangeTr={(v: string) => handleUpdate(['hero', 'subtitle', 'tr'], v)}
                        valueEn={data.hero?.subtitle?.en || ''} onChangeEn={(v: string) => handleUpdate(['hero', 'subtitle', 'en'], v)}
                    />
                    <BilingualInput label="Buton Metni"
                        valueTr={data.hero?.ctaText?.tr || ''} onChangeTr={(v: string) => handleUpdate(['hero', 'ctaText', 'tr'], v)}
                        valueEn={data.hero?.ctaText?.en || ''} onChangeEn={(v: string) => handleUpdate(['hero', 'ctaText', 'en'], v)}
                    />
                </div>
            </div>

            {/* STATS SECTION */}
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">İstatistikler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Yıllar */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-800">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-2">YILLAR (Değer)</label>
                        <input
                            type="number"
                            value={data.stats?.yearsValue || 0}
                            onChange={e => handleUpdate(['stats', 'yearsValue'], Number(e.target.value))}
                            className="w-full mb-4 p-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-center text-gray-900 dark:text-white focus:outline-none focus:border-orange-500"
                        />
                        <BilingualInput label="Etiket"
                            valueTr={data.stats?.yearsLabel?.tr || ''} onChangeTr={(v: string) => handleUpdate(['stats', 'yearsLabel', 'tr'], v)}
                            valueEn={data.stats?.yearsLabel?.en || ''} onChangeEn={(v: string) => handleUpdate(['stats', 'yearsLabel', 'en'], v)}
                        />
                    </div>

                    {/* Projeler */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-800">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-2">PROJELER (Değer)</label>
                        <input
                            type="number"
                            value={data.stats?.projectsValue || 0}
                            onChange={e => handleUpdate(['stats', 'projectsValue'], Number(e.target.value))}
                            className="w-full mb-4 p-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-center text-gray-900 dark:text-white focus:outline-none focus:border-orange-500"
                        />
                        <BilingualInput label="Etiket"
                            valueTr={data.stats?.projectsLabel?.tr || ''} onChangeTr={(v: string) => handleUpdate(['stats', 'projectsLabel', 'tr'], v)}
                            valueEn={data.stats?.projectsLabel?.en || ''} onChangeEn={(v: string) => handleUpdate(['stats', 'projectsLabel', 'en'], v)}
                        />
                    </div>

                    {/* Memnuniyet */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-800">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-2">MEMNUNİYET (%)</label>
                        <input
                            type="number"
                            value={data.stats?.satisfactionValue || 0}
                            onChange={e => handleUpdate(['stats', 'satisfactionValue'], Number(e.target.value))}
                            className="w-full mb-4 p-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-center text-gray-900 dark:text-white focus:outline-none focus:border-orange-500"
                        />
                        <BilingualInput label="Etiket"
                            valueTr={data.stats?.satisfactionLabel?.tr || ''} onChangeTr={(v: string) => handleUpdate(['stats', 'satisfactionLabel', 'tr'], v)}
                            valueEn={data.stats?.satisfactionLabel?.en || ''} onChangeEn={(v: string) => handleUpdate(['stats', 'satisfactionLabel', 'en'], v)}
                        />
                    </div>

                    {/* Şehirler */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-800">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 mb-2">ŞEHİRLER (Değer)</label>
                        <input
                            type="number"
                            value={data.stats?.citiesValue || 0}
                            onChange={e => handleUpdate(['stats', 'citiesValue'], Number(e.target.value))}
                            className="w-full mb-4 p-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-center text-gray-900 dark:text-white focus:outline-none focus:border-orange-500"
                        />
                        <BilingualInput label="Etiket"
                            valueTr={data.stats?.citiesLabel?.tr || ''} onChangeTr={(v: string) => handleUpdate(['stats', 'citiesLabel', 'tr'], v)}
                            valueEn={data.stats?.citiesLabel?.en || ''} onChangeEn={(v: string) => handleUpdate(['stats', 'citiesLabel', 'en'], v)}
                        />
                    </div>
                </div>
            </div>

            {/* FEATURES SECTION */}
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Özellikler</h3>
                    <button type="button" onClick={addFeature} className="flex items-center gap-1 text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-3 py-1.5 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors font-medium">
                        <Plus className="w-3 h-3" /> Özellik Ekle
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {data.features?.map((feature, idx) => (
                        <div key={idx} className="p-5 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl relative group shadow-sm hover:shadow-md transition-shadow">
                            <button type="button" onClick={() => removeFeature(idx)} className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* TR Sol */}
                                <div className="bg-orange-50/30 dark:bg-orange-900/10 p-4 rounded-lg border border-orange-100/50 dark:border-orange-900/20">
                                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2 block uppercase tracking-wider">Türkçe</span>
                                    <input
                                        type="text"
                                        placeholder="Başlık (TR)"
                                        value={feature.title?.tr || ''}
                                        onChange={e => handleUpdate(['features', idx.toString(), 'title', 'tr'], e.target.value)}
                                        className="w-full mb-2 p-2 bg-white dark:bg-black border border-orange-200 dark:border-orange-900/40 rounded-lg text-sm font-medium focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600"
                                    />
                                    <textarea
                                        rows={2}
                                        placeholder="Açıklama (TR)"
                                        value={feature.description?.tr || ''}
                                        onChange={e => handleUpdate(['features', idx.toString(), 'description', 'tr'], e.target.value)}
                                        className="w-full p-2 bg-white dark:bg-black border border-orange-200 dark:border-orange-900/40 rounded-lg text-xs resize-none focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600"
                                    />
                                </div>

                                {/* EN Sağ */}
                                <div className="bg-blue-50/30 dark:bg-blue-900/10 p-4 rounded-lg border border-blue-100/50 dark:border-blue-900/20">
                                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 block uppercase tracking-wider">İngilizce</span>
                                    <input
                                        type="text"
                                        placeholder="Title (EN)"
                                        value={feature.title?.en || ''}
                                        onChange={e => handleUpdate(['features', idx.toString(), 'title', 'en'], e.target.value)}
                                        className="w-full mb-2 p-2 bg-white dark:bg-black border border-blue-200 dark:border-blue-900/40 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600"
                                    />
                                    <textarea
                                        rows={2}
                                        placeholder="Description (EN)"
                                        value={feature.description?.en || ''}
                                        onChange={e => handleUpdate(['features', idx.toString(), 'description', 'en'], e.target.value)}
                                        className="w-full p-2 bg-white dark:bg-black border border-blue-200 dark:border-blue-900/40 rounded-lg text-xs resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-600"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!data.features || data.features.length === 0) && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900/10">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Henüz özellik eklenmemiş.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-end pt-4 sticky bottom-4 z-10">
                <button type="submit" disabled={saving} className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2 shadow-lg shadow-orange-500/20">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Değişiklikleri Kaydet
                </button>
            </div>
        </form>
    );
}
