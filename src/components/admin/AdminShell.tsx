"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeApp, getApps } from 'firebase/app';
import AdminSidebar from './AdminSidebar';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    // Sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // Theme state
    const [isDark, setIsDark] = useState(false);

    const isLoginPage = pathname === '/admin/login';
    const isSetupPage = pathname === '/admin/setup';

    // Persist sidebar & theme state
    useEffect(() => {
        const savedSidebar = localStorage.getItem('admin_sidebar_open');
        if (savedSidebar !== null) setIsSidebarOpen(savedSidebar === 'true');

        const savedTheme = localStorage.getItem('admin_theme');
        if (savedTheme === 'dark') setIsDark(true);
    }, []);

    const toggleSidebar = () => {
        const newState = !isSidebarOpen;
        setIsSidebarOpen(newState);
        localStorage.setItem('admin_sidebar_open', String(newState));
    };

    const toggleTheme = () => {
        const newState = !isDark;
        setIsDark(newState);
        localStorage.setItem('admin_theme', newState ? 'dark' : 'light');
    };

    useEffect(() => {
        const auth = getClientAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthorized(true);
                if (isLoginPage) router.replace('/admin');
            } else {
                setAuthorized(false);
                if (!isLoginPage && !isSetupPage) router.replace('/admin/login');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [pathname, isLoginPage, isSetupPage, router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (isLoginPage || isSetupPage) {
        return <div className={isDark ? 'dark' : ''}>{children}</div>;
    }

    if (!authorized) {
        return null;
    }

    return (
        <div className={cn("min-h-screen transition-colors duration-300", isDark ? "dark bg-black text-white" : "bg-white text-black")}>
            <div className="flex min-h-screen">
                <AdminSidebar
                    isOpen={isSidebarOpen}
                    toggle={toggleSidebar}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                />
                <main
                    className={cn(
                        "flex-1 transition-all duration-300 ease-in-out p-4 md:p-8",
                        isSidebarOpen ? "md:ml-64" : "md:ml-20"
                    )}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}
