"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Loader2, AlertCircle, CheckCircle2, Pencil } from 'lucide-react';
import { Category } from '@/types';

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Category | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetch('/api/categories')
            .then(r => r.json())
            .then(j => setCategories(j.data ?? []))
            .finally(() => setLoading(false));
    }, []);

    async function handleSave(e: FormEvent) {
        e.preventDefault();
        if (!editing) return;
        setError('');
        setSuccess('');
        setSaving(true);
        try {
            const res = await fetch(`/api/categories/${editing.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editing),
            });
            if (!res.ok) throw new Error((await res.json()).error);
            setCategories(prev => prev.map(c => c.id === editing.id ? editing : c));
            setSuccess('Kategori güncellendi!');
            setEditing(null);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Hata oluştu');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-8 text-gray-500 dark:text-gray-400">Yükleniyor...</div>;

    return (
        <div className="p-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Kategoriler</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Kategori başlık ve açıklamalarını düzenleyin</p>
            </div>

            {error && (
                <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-5">
                    <AlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
            )}
            {success && (
                <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-5">
                    <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-700 dark:text-green-300">{success}</p>
                </div>
            )}

            <div className="space-y-4">
                {categories.map(cat => (
                    <div key={cat.id} className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-5 transition-colors">
                        {editing?.id === cat.id ? (
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Başlık (TR)</label>
                                        <input type="text" value={editing.title.tr} onChange={e => setEditing({ ...editing, title: { ...editing.title, tr: e.target.value } })}
                                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Başlık (EN)</label>
                                        <input type="text" value={editing.title.en} onChange={e => setEditing({ ...editing, title: { ...editing.title, en: e.target.value } })}
                                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Açıklama (TR)</label>
                                        <textarea rows={2} value={editing.description.tr} onChange={e => setEditing({ ...editing, description: { ...editing.description, tr: e.target.value } })}
                                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Açıklama (EN)</label>
                                        <textarea rows={2} value={editing.description.en} onChange={e => setEditing({ ...editing, description: { ...editing.description, en: e.target.value } })}
                                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button type="submit" disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
                                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                                        Kaydet
                                    </button>
                                    <button type="button" onClick={() => setEditing(null)}
                                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                        İptal
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{cat.title.tr} / {cat.title.en}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cat.description.tr}</p>
                                </div>
                                <button onClick={() => setEditing(cat)}
                                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors flex-shrink-0">
                                    <Pencil className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
