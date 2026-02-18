'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Save, ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { Project } from '@/types';
import { db } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

interface ProjectFormProps {
    initialData?: Project;
    mode: 'create' | 'edit';
}

const INITIAL_DATA: Project = {
    title: { tr: '', en: '' },
    description: { tr: '', en: '' },
    image: '',
    date: '',
    location: { tr: '', en: '' },
    isActive: true,
    createdAt: '',
};

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
    const router = useRouter();
    const [data, setData] = useState<Project>(initialData || INITIAL_DATA);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const isEdit = mode === 'edit';

    // Helper to update nested fields
    const update = (path: string[], value: string) => {
        setData(prev => {
            const newObj = JSON.parse(JSON.stringify(prev));
            let curr = newObj;
            for (let i = 0; i < path.length - 1; i++) curr = curr[path[i]];
            curr[path[path.length - 1]] = value;
            return newObj;
        });
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (isEdit && initialData?.id) {
                // Update
                const docRef = doc(db, 'projects', initialData.id);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id, ...updateData } = data; // Remove ID from payload
                await updateDoc(docRef, updateData);
            } else {
                // Create
                const coll = collection(db, 'projects');
                await addDoc(coll, {
                    ...data,
                    createdAt: new Date().toISOString()
                });
            }

            router.push('/admin/projects');
            router.refresh();
        } catch (err) {
            console.error(err);
            setError('Bir hata oluştu.');
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-black p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm space-y-6">
            <div className="flex items-center justify-between mb-2">
                <Link href="/admin/projects" className="flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Geri Dön
                </Link>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isEdit ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
                </h1>
            </div>

            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-lg text-sm">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Sol Kolon - TR */}
                <div className="space-y-4 p-4 bg-orange-50/30 dark:bg-orange-900/10 rounded-xl border border-orange-100/50 dark:border-orange-900/20">
                    <h3 className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-2">Türkçe İçerik</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Başlık (TR) *</label>
                        <input
                            required
                            type="text"
                            value={data.title.tr}
                            onChange={e => update(['title', 'tr'], e.target.value)}
                            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Konum (TR)</label>
                        <input
                            type="text"
                            value={data.location?.tr || ''}
                            onChange={e => update(['location', 'tr'], e.target.value)}
                            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama (TR)</label>
                        <textarea
                            rows={4}
                            value={data.description.tr}
                            onChange={e => update(['description', 'tr'], e.target.value)}
                            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Sağ Kolon - EN */}
                <div className="space-y-4 p-4 bg-blue-50/30 dark:bg-blue-900/10 rounded-xl border border-blue-100/50 dark:border-blue-900/20">
                    <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2">İngilizce İçerik</h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (EN)</label>
                        <input
                            type="text"
                            value={data.title.en}
                            onChange={e => update(['title', 'en'], e.target.value)}
                            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location (EN)</label>
                        <input
                            type="text"
                            value={data.location?.en || ''}
                            onChange={e => update(['location', 'en'], e.target.value)}
                            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (EN)</label>
                        <textarea
                            rows={4}
                            value={data.description.en}
                            onChange={e => update(['description', 'en'], e.target.value)}
                            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Ortak Alanlar */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Genel Bilgiler</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Görsel URL *</label>
                        <div className="flex gap-2">
                            <input
                                required
                                type="text"
                                value={data.image}
                                onChange={e => setData(prev => ({ ...prev, image: e.target.value }))}
                                placeholder="https://..."
                                className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:ring-2 focus:ring-orange-500 focus:outline-none"
                            />
                            {/* İleride resim yükleme butonu eklenebilir */}
                            <button type="button" className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                <Upload className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>
                        {data.image && (
                            <div className="mt-2 relative w-full h-40 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={data.image} alt="Önizleme" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Proje Tarihi</label>
                        <input
                            type="text"
                            value={data.date || ''}
                            onChange={e => setData(prev => ({ ...prev, date: e.target.value }))}
                            placeholder="Örn: Ocak 2024"
                            className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Proje Durumu */}
            <div className="flex items-center justify-between p-4 bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800">
                <div>
                    <span className="block text-sm font-medium text-gray-900 dark:text-white">Proje Durumu</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Pasif projeler listelerde görünmez fakat silinmez.</span>
                </div>
                <button
                    type="button"
                    onClick={() => setData(prev => ({ ...prev, isActive: !prev.isActive }))}
                    className={`
                        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                        ${data.isActive !== false ? 'bg-orange-600' : 'bg-gray-200 dark:bg-gray-700'}
                    `}
                >
                    <span
                        aria-hidden="true"
                        className={`
                            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                            ${data.isActive !== false ? 'translate-x-5' : 'translate-x-0'}
                        `}
                    />
                </button>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-70"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {isEdit ? 'Değişiklikleri Kaydet' : 'Projeyi Oluştur'}
                </button>
            </div>
        </form>
    );
}
