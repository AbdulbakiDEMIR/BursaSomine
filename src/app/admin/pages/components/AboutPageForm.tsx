"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Loader2, Plus, Trash2, CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { AboutPageData } from '@/types';
import { ICON_MAP } from '@/components/ui/icons';
import { IconPicker } from '@/components/admin/IconPicker';

const INITIAL: AboutPageData = {
    history: [],
    image: '',
    features: [],
    values: [],
    valuesDescription: { tr: '', en: '' },
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
            .then(j => {
                const fetchedData = j.data || INITIAL;
                // Normalize history
                if (!Array.isArray(fetchedData.history)) {
                    fetchedData.history = [];
                }
                // Normalize features
                if (!Array.isArray(fetchedData.features)) {
                    fetchedData.features = [];
                }
                // Normalize valuesDescription 
                if (!fetchedData.valuesDescription) {
                    fetchedData.valuesDescription = { tr: '', en: '' };
                }
                // Normalize values
                if (!Array.isArray(fetchedData.values)) {
                    fetchedData.values = [];
                }
                setData(fetchedData);
            })
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

    const handleUpdate = (path: string[], value: any) => {
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

            {/* History & Description */}
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Hakkımızda & Tarihçe</h3>

                {/* Image */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Hakkımızda Görseli (URL)</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={data.image || ''}
                            onChange={e => handleUpdate(['image'], e.target.value)}
                            placeholder="https://..."
                            className="flex-1 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <button type="button" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                            <Upload className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                    {data.image && (
                        <div className="mt-2 relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={data.image} alt="Hakkımızda Önizleme" className="w-full h-full object-cover" />
                        </div>
                    )}
                </div>



                {/* History - structured with Date & Description */}
                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tarihçe (Zaman Çizelgesi)</label>
                        <button
                            type="button"
                            onClick={() => {
                                setData(prev => update(prev, ['history'], [...(prev.history || []), { date: '', description: { tr: '', en: '' } }]));
                            }}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 font-medium bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            <Plus className="w-3 h-3" /> Yeni Dönem Ekle
                        </button>
                    </div>

                    <div className="space-y-4">
                        {data.history?.map((item, idx) => (
                            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3 relative group">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData(prev => {
                                            const list = prev.history.filter((_, i) => i !== idx);
                                            return update(prev, ['history'], list);
                                        });
                                    }}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100"
                                    title="Sil"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Tarih / Yıl</label>
                                    <input
                                        type="text"
                                        value={item.date}
                                        onChange={e => {
                                            const list = [...data.history];
                                            list[idx] = { ...list[idx], date: e.target.value };
                                            handleUpdate(['history'], list as any); // Type cast needed for complex update via generic handler
                                        }}
                                        className="w-full md:w-1/3 p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-mono"
                                        placeholder="Örn: 1995 or 2000-2010"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Açıklama (TR)</label>
                                        <textarea
                                            rows={4}
                                            value={item.description.tr}
                                            onChange={e => {
                                                const list = [...data.history];
                                                list[idx] = { ...list[idx], description: { ...list[idx].description, tr: e.target.value } };
                                                handleUpdate(['history'], list as any);
                                            }}
                                            className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="Bu dönemde neler oldu?"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Description (EN)</label>
                                        <textarea
                                            rows={4}
                                            value={item.description.en}
                                            onChange={e => {
                                                const list = [...data.history];
                                                list[idx] = { ...list[idx], description: { ...list[idx].description, en: e.target.value } };
                                                handleUpdate(['history'], list as any);
                                            }}
                                            className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="What happened in this period?"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                        {(!data.history || data.history.length === 0) && (
                            <div className="text-center py-6 text-sm text-gray-400 dark:text-gray-500 italic bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                                Henüz tarihçe eklenmemiş. "Yeni Dönem Ekle" butonuna tıklayarak başlayın.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Features / Products */}
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Öne Çıkan Özellikler / Ürünler</h3>
                    <button
                        type="button"
                        onClick={() => {
                            setData(prev => update(prev, ['features'], [...(prev.features || []), { title: { tr: '', en: '' }, icon: 'Flame' }]));
                        }}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 font-medium bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Plus className="w-3 h-3" /> Ekle
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {data.features?.map((item, idx) => {
                        const IconComponent = ICON_MAP[item.icon as keyof typeof ICON_MAP] || ICON_MAP.Flame;
                        return (
                            <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3 relative group">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData(prev => {
                                            const list = prev.features.filter((_, i) => i !== idx);
                                            return update(prev, ['features'], list);
                                        });
                                    }}
                                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100"
                                    title="Sil"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>

                                <div className="flex w-full items-start gap-4 mb-4 flex-col">
                                    <div className="w-full">
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">İkon</label>
                                        <IconPicker
                                            selectedIcon={item.icon}
                                            onSelect={(icon) => {
                                                const list = [...(data.features || [])];
                                                list[idx] = { ...list[idx], icon };
                                                handleUpdate(['features'], list);
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 w-full space-y-2">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Başlık (TR)</label>
                                            <input
                                                type="text"
                                                value={item.title.tr}
                                                onChange={e => {
                                                    const list = [...(data.features || [])];
                                                    list[idx] = { ...list[idx], title: { ...list[idx].title, tr: e.target.value } };
                                                    handleUpdate(['features'], list);
                                                }}
                                                className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                placeholder="Örn: Odunlu Şömineler"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Title (EN)</label>
                                            <input
                                                type="text"
                                                value={item.title.en}
                                                onChange={e => {
                                                    const list = [...(data.features || [])];
                                                    list[idx] = { ...list[idx], title: { ...list[idx].title, en: e.target.value } };
                                                    handleUpdate(['features'], list);
                                                }}
                                                className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Ex: Wood Fireplaces"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {(!data.features || data.features.length === 0) && (
                        <div className="col-span-full text-center py-6 text-sm text-gray-400 dark:text-gray-500 italic bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                            Henüz özellik eklenmemiş. "Ekle" butonuna tıklayarak başlayın.
                        </div>
                    )}
                </div>
            </div>

            {/* Values / Philosophy */}
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Değerlerimiz</h3>
                    <button
                        type="button"
                        onClick={() => {
                            setData(prev => update(prev, ['values'], [...(prev.values || []), { title: { tr: '', en: '' }, description: { tr: '', en: '' }, icon: 'Star' }]));
                        }}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 font-medium bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"
                    >
                        <Plus className="w-3 h-3" /> Ekle
                    </button>
                </div>

                {/* Values Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Bölüm Açıklaması (TR)</label>
                        <textarea
                            rows={3}
                            value={data.valuesDescription?.tr || ''}
                            onChange={e => handleUpdate(['valuesDescription', 'tr'], e.target.value)}
                            className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                            placeholder="Değerlerimiz bölümü için genel açıklama..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Section Description (EN)</label>
                        <textarea
                            rows={3}
                            value={data.valuesDescription?.en || ''}
                            onChange={e => handleUpdate(['valuesDescription', 'en'], e.target.value)}
                            className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="General description for values section..."
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {data.values?.map((item, idx) => (
                        <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl space-y-3 relative group">
                            <button
                                type="button"
                                onClick={() => {
                                    setData(prev => {
                                        const list = prev.values.filter((_, i) => i !== idx);
                                        return update(prev, ['values'], list);
                                    });
                                }}
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-md hover:bg-white dark:hover:bg-gray-800 transition-all opacity-0 group-hover:opacity-100"
                                title="Sil"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="flex w-full items-start gap-4 mb-4 flex-col">
                                <div className="w-full">
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">İkon</label>
                                    <IconPicker
                                        selectedIcon={item.icon}
                                        onSelect={(icon) => {
                                            const list = [...(data.values || [])];
                                            list[idx] = { ...list[idx], icon };
                                            handleUpdate(['values'], list);
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                    {/* TR */}
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={item.title.tr}
                                            onChange={e => {
                                                const list = [...(data.values || [])];
                                                list[idx] = { ...list[idx], title: { ...list[idx].title, tr: e.target.value } };
                                                handleUpdate(['values'], list);
                                            }}
                                            className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="Başlık (TR)"
                                        />
                                        <textarea
                                            rows={2}
                                            value={item.description.tr}
                                            onChange={e => {
                                                const list = [...(data.values || [])];
                                                list[idx] = { ...list[idx], description: { ...list[idx].description, tr: e.target.value } };
                                                handleUpdate(['values'], list);
                                            }}
                                            className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            placeholder="Açıklama (TR)"
                                        />
                                    </div>

                                    {/* EN */}
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={item.title.en}
                                            onChange={e => {
                                                const list = [...(data.values || [])];
                                                list[idx] = { ...list[idx], title: { ...list[idx].title, en: e.target.value } };
                                                handleUpdate(['values'], list);
                                            }}
                                            className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Title (EN)"
                                        />
                                        <textarea
                                            rows={2}
                                            value={item.description.en}
                                            onChange={e => {
                                                const list = [...(data.values || [])];
                                                list[idx] = { ...list[idx], description: { ...list[idx].description, en: e.target.value } };
                                                handleUpdate(['values'], list);
                                            }}
                                            className="w-full p-2 bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Description (EN)"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!data.values || data.values.length === 0) && (
                        <div className="text-center py-6 text-sm text-gray-400 dark:text-gray-500 italic bg-gray-50/50 dark:bg-gray-900/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                            Henüz değer eklenmemiş. "Ekle" butonuna tıklayarak başlayın.
                        </div>
                    )}
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
