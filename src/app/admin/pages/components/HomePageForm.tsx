"use client";

import { useState, useEffect, FormEvent, useRef } from 'react';
import { Loader2, Plus, Trash2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { HomePageData, Project, Product } from '@/types';
import { ICON_MAP, SUPPORTED_ICONS, IconName } from '@/components/ui/icons';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

const IconPicker = ({ selectedIcon, onSelect }: { selectedIcon?: string, onSelect: (icon: string) => void }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const SelectedIconComponent = selectedIcon && ICON_MAP[selectedIcon] ? ICON_MAP[selectedIcon] : null;

    return (
        <div className="" ref={wrapperRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-colors gap-3"
            >
                <div className="flex items-center gap-3">
                    {SelectedIconComponent ? (
                        <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md text-orange-600 dark:text-orange-400">
                            <SelectedIconComponent className="w-5 h-5" />
                        </div>
                    ) : (
                        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-md" />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {selectedIcon || 'İkon Seçiniz'}
                    </span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="grid grid-cols-6 sm:grid-cols-8 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                        {SUPPORTED_ICONS.map((iconName) => {
                            const IconComponent = ICON_MAP[iconName];
                            const isSelected = selectedIcon === iconName;

                            return (
                                <button
                                    key={iconName}
                                    type="button"
                                    onClick={() => {
                                        onSelect(iconName);
                                        setIsOpen(false);
                                    }}
                                    title={iconName}
                                    className={`
                                        p-2 rounded-lg flex items-center justify-center transition-all
                                        ${isSelected
                                            ? 'bg-orange-500 text-white shadow-sm ring-2 ring-orange-200 dark:ring-orange-900'
                                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 hover:bg-orange-100 dark:hover:bg-orange-900/40 hover:text-orange-600'
                                        }
                                    `}
                                >
                                    <IconComponent className="w-5 h-5" />
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

const INITIAL: HomePageData = {
    hero: { title: { tr: '', en: '' }, subtitle: { tr: '', en: '' } },
    stats: {
        yearsLabel: { tr: '', en: '' }, yearsValue: 0,
        projectsLabel: { tr: '', en: '' }, projectsValue: 0,
        satisfactionLabel: { tr: '', en: '' }, satisfactionValue: 0,
        citiesLabel: { tr: '', en: '' }, citiesValue: 0,
    },
    features: [],
    about: {
        title: { tr: '', en: '' },
        description: { tr: '', en: '' },
        philosophy: { tr: '', en: '' },
        sinceDate: { tr: '', en: '' },
        tagline: { tr: '', en: '' }
    },
    featuredProducts: {
        title: { tr: '', en: '' },
        subtitle: { tr: '', en: '' },
        selectedProductIds: []
    }
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
    const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

    // Project Selection State
    const [projectSearchTerm, setProjectSearchTerm] = useState('');
    const [projectSortOrder, setProjectSortOrder] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
    const [showSelectedOnly, setShowSelectedOnly] = useState(false);

    const filteredProjects = availableProjects
        .filter(p => {
            const isSelected = data.selectedProjects?.includes(p.id!);
            const term = projectSearchTerm.toLowerCase();
            const matchesSearch = p.title.tr.toLowerCase().includes(term) || p.title.en.toLowerCase().includes(term);

            // If "Show Selected Only" is on, only show selected projects
            if (showSelectedOnly) {
                return isSelected && matchesSearch;
            }

            // Otherwise show all (that match search)
            // Note: We might still want to hide "Passive" projects unless they are selected, 
            // but for now let's focus on the user's request for "Selected Only".
            // Let's keep the passive hiding logic implicitly or explicitly if needed, 
            // but for "Available" list, usually we show everything unless filtered.
            // If the user wants to see "Active" status, they can see the badge.
            // Let's just show everything that matches search.
            const isActive = p.isActive !== false;
            return matchesSearch && (isActive || isSelected); // Show active OR selected (even if passive)
        })
        .sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;

            if (projectSortOrder === 'newest') return dateB - dateA;
            if (projectSortOrder === 'oldest') return dateA - dateB;
            if (projectSortOrder === 'az') return (a.title.tr || '').localeCompare(b.title.tr || '');
            if (projectSortOrder === 'za') return (b.title.tr || '').localeCompare(a.title.tr || '');
            return 0;
        });

    useEffect(() => {
        // Fetch Homepage Data
        fetch('/api/pages/home')
            .then(r => r.json())
            .then(j => {
                const fetched = j.data || {};
                setData({
                    ...INITIAL,
                    ...fetched,
                    about: fetched.about || INITIAL.about,
                    hero: { ...INITIAL.hero, ...fetched.hero },
                    stats: { ...INITIAL.stats, ...fetched.stats },
                    selectedProjects: fetched.selectedProjects || [],
                    featuredProducts: { ...INITIAL.featuredProducts, ...(fetched.featuredProducts || {}) }
                });
            })
            .catch(() => setError('Veri yüklenemedi'))
            .finally(() => setLoading(false));

        // Fetch Available Projects (Client-Side)
        const fetchProjects = async () => {
            try {
                const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project));
                setAvailableProjects(items);
            } catch (err) {
                console.error('Projects fetch error:', err);
            }
        };
        fetchProjects();

        // Fetch Available Products
        fetch('/api/products')
            .then(r => r.json())
            .then(j => {
                if (j.success) setAvailableProducts(j.data);
            })
            .catch(console.error);
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BilingualInput label="Başlık"
                        valueTr={data.hero?.title?.tr || ''} onChangeTr={(v: string) => handleUpdate(['hero', 'title', 'tr'], v)}
                        valueEn={data.hero?.title?.en || ''} onChangeEn={(v: string) => handleUpdate(['hero', 'title', 'en'], v)}
                    />
                    <BilingualInput label="Alt Başlık"
                        valueTr={data.hero?.subtitle?.tr || ''} onChangeTr={(v: string) => handleUpdate(['hero', 'subtitle', 'tr'], v)}
                        valueEn={data.hero?.subtitle?.en || ''} onChangeEn={(v: string) => handleUpdate(['hero', 'subtitle', 'en'], v)}
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
                            type="text"
                            value={data.stats?.yearsValue || 0}
                            onChange={e => handleUpdate(['stats', 'yearsValue'], e.target.value)}
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
                            type="text"
                            value={data.stats?.projectsValue || 0}
                            onChange={e => handleUpdate(['stats', 'projectsValue'], e.target.value)}
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
                            type="text"
                            value={data.stats?.satisfactionValue || 0}
                            onChange={e => handleUpdate(['stats', 'satisfactionValue'], e.target.value)}
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
                            type="text"
                            value={data.stats?.citiesValue || 0}
                            onChange={e => handleUpdate(['stats', 'citiesValue'], e.target.value)}
                            className="w-full mb-4 p-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-bold text-center text-gray-900 dark:text-white focus:outline-none focus:border-orange-500"
                        />
                        <BilingualInput label="Etiket"
                            valueTr={data.stats?.citiesLabel?.tr || ''} onChangeTr={(v: string) => handleUpdate(['stats', 'citiesLabel', 'tr'], v)}
                            valueEn={data.stats?.citiesLabel?.en || ''} onChangeEn={(v: string) => handleUpdate(['stats', 'citiesLabel', 'en'], v)}
                        />
                    </div>
                </div>
            </div>

            {/* SELECTED PROJECTS SECTION */}
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Ana Sayfada Gösterilecek Projeler (Maks 3)</h3>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Proje ara..."
                            value={projectSearchTerm}
                            onChange={(e) => setProjectSearchTerm(e.target.value)}
                            className="w-full pl-3 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-black text-gray-900 dark:text-white"
                        />
                    </div>
                    <select
                        value={projectSortOrder}
                        onChange={(e) => setProjectSortOrder(e.target.value as any)}
                        className="py-2 pl-3 pr-8 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-black text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="newest">En Yeni</option>
                        <option value="oldest">En Eski</option>
                        <option value="az">A-Z</option>
                        <option value="za">Z-A</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                        className={`
                            flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm font-medium
                            ${showSelectedOnly
                                ? 'bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400'
                                : 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-900/50 dark:border-gray-800 dark:text-gray-400'
                            }
                        `}
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        {showSelectedOnly ? 'Seçilenler' : 'Tümü'}
                    </button>
                </div>

                {/* List View */}
                <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar border border-gray-100 dark:border-gray-800 rounded-lg p-1">
                    {filteredProjects.map((project) => {
                        const isSelected = data.selectedProjects?.includes(project.id!);
                        return (
                            <div
                                key={project.id}
                                onClick={() => {
                                    const current = data.selectedProjects || [];
                                    if (isSelected) {
                                        setData(prev => ({ ...prev, selectedProjects: current.filter(id => id !== project.id) }));
                                    } else {
                                        if (current.length >= 3) {
                                            alert('En fazla 3 proje seçebilirsiniz.');
                                            return;
                                        }
                                        setData(prev => ({ ...prev, selectedProjects: [...current, project.id!] }));
                                    }
                                }}
                                className={`
                                    cursor-pointer p-3 rounded-lg border transition-all flex items-center gap-4 group
                                    ${isSelected
                                        ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-900/50'
                                    }
                                `}
                            >
                                {/* Checkbox */}
                                <div className={`
                                    w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 transition-colors
                                    ${isSelected
                                        ? 'bg-orange-500 border-orange-500'
                                        : 'border-gray-300 dark:border-gray-600 group-hover:border-orange-400'
                                    }
                                `}>
                                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </div>

                                {/* Image */}
                                {project.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={project.image} alt={project.title.tr} className="w-12 h-12 object-cover rounded-md bg-gray-200" />
                                ) : (
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center text-xs text-gray-400">No Img</div>
                                )}

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{project.title.tr}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{project.title.en}</div>
                                </div>

                                {/* Date */}
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 hidden sm:block">
                                        {project.date ? new Date(project.date).toLocaleDateString() : '-'}
                                    </div>
                                    {project.isActive === false && (
                                        <span className="inline-block mt-1 px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 text-[10px] uppercase font-bold rounded">
                                            Pasif
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {filteredProjects.length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-8">
                            {availableProjects.length === 0 ? (
                                <>Henüz proje eklenmemiş. <a href="/admin/seed" className="text-orange-500 underline">Örnek Proje Ekle</a></>
                            ) : (
                                'Aramanızla eşleşen proje bulunamadı.'
                            )}
                        </div>
                    )}
                </div>

                <div className="text-xs text-right text-gray-500">
                    Seçilen: <span className="font-medium text-orange-600">{data.selectedProjects?.length || 0}/3</span>
                </div>
            </div>

            {/* FEATURED PRODUCTS SECTION */}
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Öne Çıkan Ürünler Ayarları</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BilingualInput label="Başlık"
                        valueTr={data.featuredProducts?.title?.tr || ''} onChangeTr={(v: string) => handleUpdate(['featuredProducts', 'title', 'tr'], v)}
                        valueEn={data.featuredProducts?.title?.en || ''} onChangeEn={(v: string) => handleUpdate(['featuredProducts', 'title', 'en'], v)}
                    />
                    <BilingualInput label="Alt Başlık"
                        valueTr={data.featuredProducts?.subtitle?.tr || ''} onChangeTr={(v: string) => handleUpdate(['featuredProducts', 'subtitle', 'tr'], v)}
                        valueEn={data.featuredProducts?.subtitle?.en || ''} onChangeEn={(v: string) => handleUpdate(['featuredProducts', 'subtitle', 'en'], v)}
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">Gösterilecek Ürünler (Maks 10)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                        {availableProducts.map((product) => {
                            const isSelected = data.featuredProducts?.selectedProductIds?.includes(product.id!);
                            return (
                                <div
                                    key={product.id}
                                    onClick={() => {
                                        const current = data.featuredProducts?.selectedProductIds || [];
                                        if (isSelected) {
                                            setData(prev => update(prev, ['featuredProducts', 'selectedProductIds'], current.filter(id => id !== product.id)));
                                        } else {
                                            if (current.length >= 10) {
                                                alert('En fazla 10 ürün seçebilirsiniz.');
                                                return;
                                            }
                                            setData(prev => update(prev, ['featuredProducts', 'selectedProductIds'], [...current, product.id!]));
                                        }
                                    }}
                                    className={`
                                        cursor-pointer p-3 rounded-xl border transition-all flex items-start gap-3 relative
                                        ${isSelected
                                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 ring-1 ring-orange-500'
                                            : 'border-gray-200 dark:border-gray-800 hover:border-orange-300 dark:hover:border-orange-700'
                                        }
                                    `}
                                >
                                    <div className={`
                                        w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5
                                        ${isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300 dark:border-gray-600'}
                                    `}>
                                        {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{product.name.tr}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{product.category}</div>
                                    </div>
                                    {product.images && product.images[0] && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={product.images[0]} alt={product.name.tr} className="w-8 h-8 object-cover rounded-md bg-gray-100" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ABOUT SECTION */}
            <div className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
                <h3 className="font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Hakkımızda Alanı</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BilingualInput label="Başlık"
                        valueTr={data.about?.title?.tr || ''} onChangeTr={(v: string) => handleUpdate(['about', 'title', 'tr'], v)}
                        valueEn={data.about?.title?.en || ''} onChangeEn={(v: string) => handleUpdate(['about', 'title', 'en'], v)}
                    />
                    <BilingualInput label="Slogan (Tagline)"
                        valueTr={data.about?.tagline?.tr || ''} onChangeTr={(v: string) => handleUpdate(['about', 'tagline', 'tr'], v)}
                        valueEn={data.about?.tagline?.en || ''} onChangeEn={(v: string) => handleUpdate(['about', 'tagline', 'en'], v)}
                    />
                    <BilingualInput label="Kuruluş Yılı / Metni"
                        valueTr={data.about?.sinceDate?.tr || ''} onChangeTr={(v: string) => handleUpdate(['about', 'sinceDate', 'tr'], v)}
                        valueEn={data.about?.sinceDate?.en || ''} onChangeEn={(v: string) => handleUpdate(['about', 'sinceDate', 'en'], v)}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-1">Açıklama / Tarihçe</label>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">TR</span>
                                <textarea
                                    rows={4}
                                    value={data.about?.description?.tr || ''}
                                    onChange={e => handleUpdate(['about', 'description', 'tr'], e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50/30 dark:bg-orange-900/10 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">EN</span>
                                <textarea
                                    rows={4}
                                    value={data.about?.description?.en || ''}
                                    onChange={e => handleUpdate(['about', 'description', 'en'], e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/30 dark:bg-blue-900/10 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-1">Felsefe</label>
                        <div className="grid grid-cols-1 gap-2">
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">TR</span>
                                <textarea
                                    rows={4}
                                    value={data.about?.philosophy?.tr || ''}
                                    onChange={e => handleUpdate(['about', 'philosophy', 'tr'], e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50/30 dark:bg-orange-900/10 text-gray-900 dark:text-white"
                                />
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-2 text-xs font-bold text-gray-400">EN</span>
                                <textarea
                                    rows={4}
                                    value={data.about?.philosophy?.en || ''}
                                    onChange={e => handleUpdate(['about', 'philosophy', 'en'], e.target.value)}
                                    className="w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-50/30 dark:bg-blue-900/10 text-gray-900 dark:text-white"
                                />
                            </div>
                        </div>
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

                                {/* Icon Selection */}
                                <div className="relative md:col-span-2 flex flex-col items-start">
                                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-400 uppercase tracking-wider mb-2">
                                        İkon Seçimi
                                    </label>

                                    <IconPicker
                                        selectedIcon={feature.icon}
                                        onSelect={(icon) => handleUpdate(['features', idx.toString(), 'icon'], icon)}
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
