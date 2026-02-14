"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Flame } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';

export default function Footer() {
    const t = useTranslations('Footer');
    const tNav = useTranslations('Navigation');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-muted/50 border-t border-border pt-16 pb-8 flex justify-center">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                                <Flame className="w-6 h-6 text-accent" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">Bursa Şömine</span>
                        </Link>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            {t('brandDescription')}
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                            <a href="https://instagram.com/bursa.somine" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-all">
                                <Facebook className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-full bg-background border border-border hover:border-primary hover:text-primary transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">{t('quickLinks')}</h3>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-primary transition-colors inline-block w-fit">{tNav('home')}</Link>
                            <Link href="/about" className="hover:text-primary transition-colors inline-block w-fit">{tNav('about')}</Link>
                            <Link href="/portfolio" className="hover:text-primary transition-colors inline-block w-fit">{tNav('portfolio')}</Link>
                            <Link href="/contact" className="hover:text-primary transition-colors inline-block w-fit">{tNav('contact')}</Link>
                            <Link href="/faq" className="hover:text-primary transition-colors inline-block w-fit">{t('faq')}</Link>
                        </nav>
                    </div>

                    {/* Products */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">{t('products')}</h3>
                        <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
                            {CATEGORIES.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={cat.href}
                                    className="hover:text-primary transition-colors inline-block w-fit"
                                >
                                    {cat.title}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">{t('contact')}</h3>
                        <div className="flex flex-col gap-4 text-sm text-muted-foreground">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <span>{t('address')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-primary shrink-0" />
                                <a href="tel:+902241234567" className="hover:text-primary transition-colors">{t('phone')}</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-primary shrink-0" />
                                <a href="mailto:info@bursasomine.com" className="hover:text-primary transition-colors">{t('email')}</a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-border pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>
                        &copy; {currentYear} {t('rights')}
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/return-policy" className="hover:text-primary transition-colors">{t('returnPolicy')}</Link>
                        {/* <Link href="/privacy" className="hover:text-primary transition-colors">Politikalar</Link> */}
                        {/* <Link href="/terms" className="hover:text-primary transition-colors">Kullanım Şartları</Link> */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
