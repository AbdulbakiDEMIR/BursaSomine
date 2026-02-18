"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Tag,
    FileText,
    Settings,
    LogOut,
    Flame,
    PanelLeftClose,
    PanelLeftOpen,
    Sun,
    Moon,
} from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import { cn } from '@/lib/utils';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getClientAuth() {
    const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    return getAuth(app);
}

const NAV_ITEMS = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Ürünler', icon: Package },
    { href: '/admin/categories', label: 'Kategoriler', icon: Tag },
    { href: '/admin/pages', label: 'Sayfa İçerikleri', icon: FileText },
    { href: '/admin/settings', label: 'Site Ayarları', icon: Settings },
];

interface AdminSidebarProps {
    isOpen: boolean;
    toggle: () => void;
    isDark: boolean;
    toggleTheme: () => void;
}

export default function AdminSidebar({ isOpen, toggle, isDark, toggleTheme }: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    async function handleLogout() {
        const auth = getClientAuth();
        await signOut(auth);
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
    }

    return (
        <aside
            className={cn(
                "fixed top-0 left-0 z-40 h-screen flex flex-col transition-all duration-300 shadow-xl border-r",
                isOpen ? "w-64" : "w-17 w-[68px]", // w-17 approx 68px
                // Theme Colors
                "bg-white dark:bg-black",
                "border-gray-200 dark:border-gray-800",
                "text-gray-900 dark:text-white"
            )}
        >
            {/* Toggle Button (Outside - Absolute) */}
            <button
                onClick={toggle}
                className={cn(
                    "absolute -right-8 top-5 p-1.5 hover:scale-110 transition-all z-50 flex items-center justify-center w-8 h-8",
                    // Theme Colors for Toggle Button
                    "text-gray-500 hover:text-orange-500"
                )}
            >
                {isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
            </button>

            {/* Header / Logo */}
            <div className={cn("flex items-center h-20 border-b transition-all relative",
                isOpen ? "px-6" : "px-0 justify-center",
                "border-gray-200 dark:border-gray-800"
            )}>
                <Link href="/admin" className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                    <div className="w-10 h-10 bg-orange-500 rounded-xl flex-shrink-0 flex items-center justify-center shadow-lg shadow-orange-500/20">
                        <Flame className="w-6 h-6 text-white" />
                    </div>
                    {isOpen && (
                        <div className="transition-opacity duration-300 opacity-100">
                            <p className="font-bold text-base leading-tight">Bursa Sömine</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase">Yönetim Paneli</p>
                        </div>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 mt-4 overflow-x-hidden">
                {NAV_ITEMS.map((item) => {
                    const isActive = item.exact
                        ? pathname === item.href
                        : pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={!isOpen ? item.label : undefined}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative',
                                isActive
                                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-white" : "text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white")} />

                            {/* Label */}
                            <span className={cn(
                                "whitespace-nowrap transition-all duration-300 origin-left",
                                isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 absolute pointer-events-none"
                            )}>
                                {item.label}
                            </span>

                            {/* Tooltip for Collapsed State */}
                            {!isOpen && (
                                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none border border-gray-700 dark:border-gray-200 shadow-xl">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer Actions (Theme + Logout) */}
            <div className={cn("p-3 border-t space-y-2", "border-gray-200 dark:border-gray-800")}>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    title={!isOpen ? (isDark ? "Açık Tema" : "Koyu Tema") : undefined}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full group overflow-hidden",
                        isOpen ? "" : "justify-center",
                        "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white"
                    )}
                >
                    {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
                    {isOpen && <span className="whitespace-nowrap transition-opacity">{isDark ? 'Açık Tema' : 'Koyu Tema'}</span>}
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    title={!isOpen ? "Çıkış Yap" : undefined}
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full group overflow-hidden",
                        isOpen ? "" : "justify-center",
                        "text-red-500/80 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                    )}
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span className="whitespace-nowrap transition-opacity">Çıkış Yap</span>}
                </button>
            </div>
        </aside>
    );
}
