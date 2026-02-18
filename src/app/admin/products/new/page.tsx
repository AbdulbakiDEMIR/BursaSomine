"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface ProductFormData {
    nameTr: string;
    nameEn: string;
    descTr: string;
    descEn: string;
    price: string;
    category: 'wood' | 'ethanol' | 'electric';
    isFeatured: boolean;
    images: string;
}

const INITIAL: ProductFormData = {
    nameTr: '', nameEn: '', descTr: '', descEn: '',
    price: '', category: 'wood', isFeatured: false, images: '',
};

export default function NewProductPage() {
    const router = useRouter();
    const [form, setForm] = useState<ProductFormData>(INITIAL);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    function handleChange(field: keyof ProductFormData, value: string | boolean) {
        setForm(prev => ({ ...prev, [field]: value }));
    }

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const body = {
                name: { tr: form.nameTr, en: form.nameEn },
                description: { tr: form.descTr, en: form.descEn },
                price: form.price,
                category: form.category,
                isFeatured: form.isFeatured,
                images: form.images ? form.images.split('\n').map(s => s.trim()).filter(Boolean) : [],
                createdAt: new Date().toISOString(),
            };

            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Ürün eklenemedi.');
            }

            setSuccess(true);
            setTimeout(() => router.push('/admin/products'), 1500);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="p-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <ArrowLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Yeni Ürün</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Yeni bir ürün ekleyin</p>
                </div>
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
                    <p className="text-sm text-green-700 dark:text-green-300">Ürün başarıyla eklendi! Yönlendiriliyorsunuz...</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 space-y-5 transition-colors">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ürün Adı (TR) *</label>
                        <input type="text" required value={form.nameTr} onChange={e => handleChange('nameTr', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ürün Adı (EN) *</label>
                        <input type="text" required value={form.nameEn} onChange={e => handleChange('nameEn', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama (TR)</label>
                        <textarea rows={3} value={form.descTr} onChange={e => handleChange('descTr', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama (EN)</label>
                        <textarea rows={3} value={form.descEn} onChange={e => handleChange('descEn', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fiyat *</label>
                        <input type="text" required placeholder="25.000 TL" value={form.price} onChange={e => handleChange('price', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori *</label>
                        <select value={form.category} onChange={e => handleChange('category', e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="wood">Odunlu</option>
                            <option value="ethanol">Etanollü</option>
                            <option value="electric">Elektrikli</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resim URL&apos;leri (her satıra bir URL)</label>
                    <textarea rows={3} placeholder="https://images.unsplash.com/..." value={form.images} onChange={e => handleChange('images', e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono" />
                </div>

                <div className="flex items-center gap-3">
                    <input type="checkbox" id="isFeatured" checked={form.isFeatured} onChange={e => handleChange('isFeatured', e.target.checked)}
                        className="w-4 h-4 accent-orange-500 bg-white dark:bg-black border-gray-300 dark:border-gray-700 rounded" />
                    <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 dark:text-gray-300">Öne çıkan ürün olarak işaretle</label>
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={loading || success}
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-orange-500/20">
                        {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Kaydediliyor...</> : 'Ürünü Kaydet'}
                    </button>
                    <Link href="/admin/products" className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        İptal
                    </Link>
                </div>
            </form>
        </div>
    );
}
