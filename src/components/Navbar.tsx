import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
    const t = useTranslations('Navigation');

    return (
        <header className="sticky top-0 z-50 w-full flex justify-center border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="container flex h-16 items-center justify-between">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block text-xl">
                            Bursa Şömine
                        </span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link href="/" className="transition-colors hover:text-foreground/80 text-foreground/60">{t('home')}</Link>
                        <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                            {t('about')}
                        </Link>
                        <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">{t('products')}</Link>
                        <Link href="/portfolio" className="transition-colors hover:text-foreground/80 text-foreground/60">{t('portfolio')}</Link>
                        <Link href="/contact" className="transition-colors hover:text-foreground/80 text-foreground/60">{t('contact')}</Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search placeholder */}
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </header>
    );
}
