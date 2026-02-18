"use client";

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [id, setId] = useState('');
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form state
    const [nameTr, setNameTr] = useState('');
    const [nameEn, setNameEn] = useState('');
    const [descTr, setDescTr] = useState('');
    const [descEn, setDescEn] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<'wood' | 'ethanol' | 'electric'>('wood');
    const [isFeatured, setIsFeatured] = useState(false);
    const [images, setImages] = useState('');

    useEffect(() => {
        params.then(p => {
            setId(p.id);
            fetch(`/api/products/${p.id}`)
                .then(r => r.json())
                .then(json => {
                    const p2: Product = json.data;
                    setProduct(p2);
                    setNameTr(p2.name.tr);
                    setNameEn(p2.name.en);
                    setDescTr(p2.description.tr);
                    setDescEn(p2.description.en);
                    setPrice(p2.price);
                    setCategory(p2.category);
                    setIsFeatured(p2.isFeatured);
                    setImages((p2.images ?? []).join('\n'));
                })
                .catch(() => setError('Ürün yüklenemedi.'))
                .finally(() => setLoading(false));
        });
    }, [params]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            const body = {
                name: { tr: nameTr, en: nameEn },
                description: { tr: descTr, en: descEn },
                price, category, isFeatured,
                images: images ? images.split('\n').map(s => s.trim()).filter(Boolean) : [],
            };
            const res = await fetch(`/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Güncellenemedi.');
            }
            setSuccess(true);
            setTimeout(() => router.push('/admin/products'), 1500);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Bilinmeyen hata');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-8 text-gray-500 dark:text-gray-400">Yükleniyor...</div>;
    if (!product && !loading) return <div className="p-8 text-red-500 dark:text-red-400">Ürün bulunamadı.</div>;

    return (
        <div className="p-8 max-w-2xl">
            <div className="flex items-center gap-3 mb-8">
                <Link href="/admin/products" className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors">
                    <ArrowLeft className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ürün Düzenle</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{product?.name.tr}</p>
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
                    <p className="text-sm text-green-700 dark:text-green-300">Ürün güncellendi!</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 space-y-5 transition-colors">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ürün Adı (TR) *</label>
                        <input type="text" required value={nameTr} onChange={e => setNameTr(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ürün Adı (EN) *</label>
                        <input type="text" required value={nameEn} onChange={e => setNameEn(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama (TR)</label>
                        <textarea rows={3} value={descTr} onChange={e => setDescTr(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Açıklama (EN)</label>
                        <textarea rows={3} value={descEn} onChange={e => setDescEn(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fiyat *</label>
                        <input type="text" required value={price} onChange={e => setPrice(e.target.value)}
                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori *</label>
                        <select value={category} onChange={e => setCategory(e.target.value as 'wood' | 'ethanol' | 'electric')}
                            className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
                            <option value="wood">Odunlu</option>
                            <option value="ethanol">Etanollü</option>
                            <option value="electric">Elektrikli</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Resim URL&apos;leri (her satıra bir URL)</label>
                    <textarea rows={3} value={images} onChange={e => setImages(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono" />
                </div>
                <div className="flex items-center gap-3">
                    <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 accent-orange-500 bg-white dark:bg-black border-gray-300 dark:border-gray-700 rounded" />
                    <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700 dark:text-gray-300">Öne çıkan ürün</label>
                </div>
                <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={saving || success}
                        className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-orange-500/20">
                        {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Kaydediliyor...</> : 'Güncelle'}
                    </button>
                    <Link href="/admin/products" className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        İptal
                    </Link>
                </div>
            </form>
        </div>
    );
}
