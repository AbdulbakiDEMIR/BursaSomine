"use client";

import { useState, useEffect, FormEvent } from 'react';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '@/types';

const EMPTY: SiteSettings = {
    brandName: '',
    contact: { address: '', phone: '', email: '', hours: { tr: '', en: '' } },
    socialMedia: { instagram: '', facebook: '' },
};

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<SiteSettings>(EMPTY);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetch('/api/site-settings')
            .then(r => r.json())
            .then(j => setSettings(j.data ?? EMPTY))
            .finally(() => setLoading(false));
    }, []);

    function update(path: string[], value: string) {
        setSettings(prev => {
            const next = JSON.parse(JSON.stringify(prev)) as SiteSettings;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let obj: any = next;
            for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
            obj[path[path.length - 1]] = value;
            return next;
        });
    }

    async function handleSave(e: FormEvent) {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSaving(true);
        try {
            const res = await fetch('/api/site-settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings),
            });
            if (!res.ok) throw new Error((await res.json()).error);
            setSuccess('Site ayarları güncellendi!');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Hata oluştu');
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-8 text-gray-500 dark:text-gray-400">Yükleniyor...</div>;

    const field = (label: string, path: string[], value: string, type = 'text') => (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
            <input type={type} value={value} onChange={e => update(path, e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
        </div>
    );

    return (
        <div className="p-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Ayarları</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">İletişim bilgileri ve sosyal medya</p>
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

            <form onSubmit={handleSave} className="space-y-6">
                {/* Genel */}
                <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Genel</h2>
                    {field('Marka Adı', ['brandName'], settings.brandName)}
                </div>

                {/* İletişim */}
                <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">İletişim</h2>
                    {field('Adres', ['contact', 'address'], settings.contact.address)}
                    {field('Telefon', ['contact', 'phone'], settings.contact.phone, 'tel')}
                    {field('E-posta', ['contact', 'email'], settings.contact.email, 'email')}
                    <div className="grid grid-cols-2 gap-4">
                        {field('Çalışma Saatleri (TR)', ['contact', 'hours', 'tr'], settings.contact.hours.tr)}
                        {field('Çalışma Saatleri (EN)', ['contact', 'hours', 'en'], settings.contact.hours.en)}
                    </div>
                </div>

                {/* Sosyal Medya */}
                <div className="bg-white dark:bg-black rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 space-y-4">
                    <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">Sosyal Medya</h2>
                    {field('Instagram URL', ['socialMedia', 'instagram'], settings.socialMedia.instagram, 'url')}
                    {field('Facebook URL', ['socialMedia', 'facebook'], settings.socialMedia.facebook ?? '', 'url')}
                </div>

                <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white rounded-lg font-medium text-sm transition-colors shadow-lg shadow-orange-500/20">
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Kaydediliyor...</> : 'Ayarları Kaydet'}
                </button>
            </form>
        </div>
    );
}
