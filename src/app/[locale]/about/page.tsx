"use client";

import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/SectionWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import Image from 'next/image';
import { Flame, Zap, Droplets, Trophy, Users, ShieldCheck, Target, Heart } from 'lucide-react';

export default function AboutPage() {
    const t = useTranslations('AboutPage');

    return (
        <main className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80"
                        alt="About Us Background"
                        fill
                        className="object-cover brightness-[0.4]"
                        priority
                    />
                </div>
                <div className="relative z-10 container text-center text-white space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight">{t('title')}</h1>
                    <div className="w-20 h-1 bg-orange-500 mx-auto rounded-full" />
                </div>
            </section>

            {/* History & Intro Section */}
            <SectionWrapper>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <SectionHeader title={t('historyTitle')} className="text-left items-start" />
                        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                <span className="font-bold text-primary text-xl">1990</span> - {t('historyText1')}
                            </p>
                            <p>
                                <span className="font-bold text-primary text-xl">2011</span> - {t('historyText2')}
                            </p>
                        </div>
                    </div>
                    <div className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
                        <Image
                            src="https://images.unsplash.com/photo-1504198358623-6e7f1695cd3f?auto=format&fit=crop&q=80"
                            alt="Bursa Somine Factory/Workshop"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </SectionWrapper>

            {/* Products Section */}
            <SectionWrapper className="bg-muted/30">
                <SectionHeader
                    title={t('productsTitle')}
                    subtitle={t('productsText')}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-background p-8 rounded-xl shadow-sm border border-border/50 flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-2">
                            <Flame className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">{t('product1')}</h3>
                    </div>
                    <div className="bg-background p-8 rounded-xl shadow-sm border border-border/50 flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
                            <Zap className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">{t('product2')}</h3>
                    </div>
                    <div className="bg-background p-8 rounded-xl shadow-sm border border-border/50 flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 rounded-full bg-cyan-100 text-cyan-600 flex items-center justify-center mb-2">
                            <Droplets className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold">{t('product3')}</h3>
                    </div>
                </div>
            </SectionWrapper>

            {/* Values Section */}
            <SectionWrapper>
                <SectionHeader title={t('valuesTitle')} subtitle={t('philosophyText')} />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-start space-x-4 p-6 rounded-lg bg-primary text-primary-foreground">
                        <div className="flex-shrink-0">
                            <Trophy className="w-10 h-10 text-orange-500" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-1">{t('value1')}</h4>
                            <p className="text-sm opacity-80">Kaliteden ödün vermeyen üretim anlayışı.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4 p-6 rounded-lg bg-primary text-primary-foreground">
                        <div className="flex-shrink-0">
                            <Heart className="w-10 h-10 text-orange-500" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-1">{t('value2')}</h4>
                            <p className="text-sm opacity-80">Mutlu müşteriler en büyük referansımızdır.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-4 p-6 rounded-lg bg-primary text-primary-foreground">
                        <div className="flex-shrink-0">
                            <ShieldCheck className="w-10 h-10 text-orange-500" />
                        </div>
                        <div>
                            <h4 className="text-lg font-bold mb-1">{t('value3')}</h4>
                            <p className="text-sm opacity-80">Satış öncesi ve sonrası tam destek.</p>
                        </div>
                    </div>
                </div>
            </SectionWrapper>

            {/* Vision & Mission */}
            <SectionWrapper className="bg-muted/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="bg-background p-10 rounded-2xl shadow-sm border-l-4 border-orange-500">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                                <Target className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold">{t('visionTitle')}</h3>
                        </div>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {t('visionText')}
                        </p>
                    </div>

                    <div className="bg-background p-10 rounded-2xl shadow-sm border-l-4 border-blue-500">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold">{t('missionTitle')}</h3>
                        </div>
                        <ul className="space-y-4 text-muted-foreground">
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                                <span>{t('mission1')}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                                <span>{t('mission2')}</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-2 h-2 rounded-full bg-blue-500 mt-2.5 flex-shrink-0" />
                                <span>{t('mission3')}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </SectionWrapper>
        </main>
    );
}
