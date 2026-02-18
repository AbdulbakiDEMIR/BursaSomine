"use client";

import { useState, FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { Flame, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

const firebaseConfig = {
    apiKey: "AIzaSyA1fckfMPf8fPd4eFe9jFyCafxvjWcHKwA",
    authDomain: "firstwebdeploy.firebaseapp.com",
    projectId: "firstwebdeploy",
    storageBucket: "firstwebdeploy.firebasestorage.app",
    messagingSenderId: "1090743785159",
    appId: "1:1090743785159:web:1b197f370158c1ae7350e2",
};

function getClientAuth() {
    const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    return getAuth(app);
}

export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/admin';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const auth = getClientAuth();
            await signInWithEmailAndPassword(auth, email, password);
            router.push(from);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Bilinmeyen hata';
            if (errorMessage.includes('invalid-credential') || errorMessage.includes('wrong-password') || errorMessage.includes('user-not-found')) {
                setError('E-posta veya şifre hatalı.');
            } else if (errorMessage.includes('too-many-requests')) {
                setError('Çok fazla başarısız deneme. Lütfen bekleyin.');
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-950 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 rounded-2xl mb-4 shadow-lg shadow-orange-500/30">
                        <Flame className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Bursa Sömine</h1>
                    <p className="text-gray-400 text-sm mt-1">Admin Paneli</p>
                </div>

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-lg font-semibold text-white mb-6">Giriş Yap</h2>

                    {error && (
                        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-5">
                            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-300">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">E-posta</label>
                            <input
                                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="admin@bursasomine.com"
                                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5">Şifre</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                                    className="w-full px-4 py-2.5 pr-11 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 mt-2">
                            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Giriş yapılıyor...</> : 'Giriş Yap'}
                        </button>
                    </form>
                </div>
                <p className="text-center text-xs text-gray-600 mt-6">Bursa Sömine © {new Date().getFullYear()} — Yönetim Paneli</p>
            </div>
        </div>
    );
}
