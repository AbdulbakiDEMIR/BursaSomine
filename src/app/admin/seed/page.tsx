'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const NEW_SAMPLE_PROJECTS = [
    {
        title: { tr: 'Modern Kış Bahçesi', en: 'Modern Winter Garden' },
        description: {
            tr: 'Cam ağırlıklı kış bahçesi için özel olarak tasarlanan 3 taraflı camlı odunlu şömine uygulaması. Mekanın aydınlık yapısına uyum sağlayan minimalist tasarım.',
            en: '3-sided glass wood fireplace application specially designed for a glass-heavy winter garden. Minimalist design that adapts to the bright structure of the space.'
        },
        image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80',
        date: '2024-01-15',
        location: { tr: 'Çekirge, Bursa', en: 'Cekirge, Bursa' },
        createdAt: new Date().toISOString()
    },
    {
        title: { tr: 'Loft Daire Şöminesi', en: 'Loft Apartment Fireplace' },
        description: {
            tr: 'Yüksek tavanlı loft daire için endüstriyel tasarımlı asma şömine. Mekanın merkezinde yer alan bu şömine, 360 derece dönebilme özelliği ile her açıdan ateş keyfi sunuyor.',
            en: 'Industrial design suspended fireplace for high-ceiling loft apartment. Located in the center of the space, this fireplace offers fire enjoyment from every angle with its 360-degree rotation feature.'
        },
        image: 'https://images.unsplash.com/photo-1552083375-1447ce886485?auto=format&fit=crop&q=80',
        date: '2023-11-20',
        location: { tr: 'Nilüfer, Bursa', en: 'Nilufer, Bursa' },
        createdAt: new Date().toISOString()
    },
    {
        title: { tr: 'Rustik Dağ Evi', en: 'Rustic Mountain House' },
        description: {
            tr: 'Uludağ eteklerindeki ahşap dağ evi için doğal taş kaplamalı geleneksel şömine. Geniş ateş haznesi ile tüm salonu ısıtma kapasitesine sahip.',
            en: 'Traditional fireplace with natural stone cladding for a wooden mountain house at the foot of Uludag. Capable of heating the entire living room with its large firebox.'
        },
        image: 'https://images.unsplash.com/photo-1542384557-0e856f743131?auto=format&fit=crop&q=80',
        date: '2023-12-05',
        location: { tr: 'Uludağ, Bursa', en: 'Uludag, Bursa' },
        createdAt: new Date().toISOString()
    }
];

export default function SeedPage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSeed = async () => {
        setLoading(true);
        setStatus('idle');
        setMessage('');

        try {
            const projectsRef = collection(db, 'projects');

            for (const project of NEW_SAMPLE_PROJECTS) {
                await addDoc(projectsRef, {
                    ...project,
                    createdAt: serverTimestamp() // Use server timestamp
                });
            }

            setStatus('success');
            setMessage('3 yeni proje başarıyla eklendi!');
        } catch (error: any) {
            console.error('Seeding error:', error);
            setStatus('error');
            setMessage('Hata oluştu: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8">
            <div className="space-y-4 text-center">
                <h1 className="text-3xl font-bold">Yeni Projeler Ekle</h1>
                <p className="text-muted-foreground">
                    Veritabanına 3 adet yeni örnek proje eklemek için aşağıdaki butona tıklayın.
                </p>
            </div>

            <div className="flex flex-col items-center gap-4">
                <Button
                    size="lg"
                    onClick={handleSeed}
                    disabled={loading}
                    className="w-full sm:w-auto"
                >
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Ekleniyor...
                        </>
                    ) : (
                        '3 Yeni Proje Ekle'
                    )}
                </Button>

                {status === 'success' && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{message}</span>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg border border-red-200">
                        <AlertCircle className="w-5 h-5" />
                        <span>{message}</span>
                    </div>
                )}
            </div>

            <div className="pt-8 border-t">
                <h3 className="font-semibold mb-4">Eklenecek Projeler:</h3>
                <ul className="space-y-4">
                    {NEW_SAMPLE_PROJECTS.map((p, i) => (
                        <li key={i} className="flex gap-4 p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                            <div className="w-20 h-20 flex-shrink-0 bg-secondary rounded-md overflow-hidden relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.image} alt={p.title.tr} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-medium">{p.title.tr}</h4>
                                <p className="text-sm text-muted-foreground line-clamp-2">{p.description.tr}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="flex justify-center pt-4">
                <Button variant="outline" onClick={() => router.push('/admin/projects')}>
                    Proje Listesine Dön
                </Button>
            </div>
        </div>
    );
}
