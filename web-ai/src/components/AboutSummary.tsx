"use client";

import { SectionWrapper } from '@/components/SectionWrapper';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/routing';
import ImageWithLoader from '@/components/ui/image-with-loader';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function AboutSummary() {
    const t = useTranslations('AboutPage');

    return (
        <SectionWrapper className="bg-secondary/30">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary">{t('title')}</h2>
                        <div className="w-20 h-1.5 bg-orange-500 rounded-full" />
                    </div>

                    <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                        <p>
                            {t('historyText1')}
                        </p>
                        <p className="border-l-4 border-orange-200 pl-4 py-2 italic font-serif">
                            "{t('philosophyText')}"
                        </p>
                    </div>

                    <div className="pt-4">
                        <Button size="lg" variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-400 group" asChild>
                            <Link href="/about" className="flex items-center gap-2">
                                {t('learnMore')}
                                <span className="block transition-transform group-hover:translate-x-1">→</span>
                            </Link>
                        </Button>
                    </div>
                </motion.div>

                {/* Image Content */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl group"
                >
                    <ImageWithLoader
                        src="https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80"
                        alt="Bursa Somine Showroom"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                    <div className="absolute bottom-8 left-8 text-white z-10">
                        <p className="font-bold text-3xl mb-1">{t('since')}</p>
                        <p className="text-lg text-white/80 font-light">{t('tagline')}</p>
                    </div>

                    {/* Decorative Corner */}
                    <div className="absolute top-6 right-6 w-16 h-16 border-t-4 border-r-4 border-white/20 rounded-tr-3xl" />
                </motion.div>
            </div>
        </SectionWrapper>
    );
}
