"use client";

import { Link, usePathname } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const t = useTranslations('Navigation');
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(href);
    };

    const navLinks = [
        { href: '/', label: t('home') },
        { href: '/about', label: t('about') },
        { href: '/products', label: t('products') },
        { href: '/portfolio', label: t('portfolio') },
        { href: '/contact', label: t('contact') },
    ];

    return (
        <header className="sticky top-0 z-50 w-full flex justify-center border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo and Desktop Nav */}
                <div className="flex items-center">
                    <Link href="/" className="mr-8 flex items-center space-x-2">
                        <span className="font-bold text-xl text-primary">
                            Bursa Şömine
                        </span>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "transition-colors hover:text-primary",
                                    isActive(link.href)
                                        ? "text-primary font-bold"
                                        : "text-foreground/60"
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex">
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile Menu Trigger */}
                    <div className="md:hidden flex items-center gap-4">
                        <LanguageSwitcher />
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-6 w-6" />
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetHeader className="mb-8">
                                    <SheetTitle className="text-left text-xl font-bold text-primary">Bursa Şömine</SheetTitle>
                                </SheetHeader>
                                <nav className="flex flex-col gap-4">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={cn(
                                                "text-lg font-medium transition-colors hover:text-primary py-2",
                                                isActive(link.href)
                                                    ? "text-primary font-bold"
                                                    : "text-foreground/60"
                                            )}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}
