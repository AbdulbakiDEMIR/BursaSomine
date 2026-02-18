"use client";

import { SectionWrapper } from '@/components/SectionWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import { motion } from 'framer-motion';
import { Search, PenTool, Hammer, Home } from 'lucide-react';

import { useTranslations } from 'next-intl';

export default function ProcessSection() {
    const t = useTranslations('HomePage.process');

    const STEPS = [
        {
            icon: Search,
            title: t('step1Title'),
            description: t('step1Desc'),
        },
        {
            icon: PenTool,
            title: t('step2Title'),
            description: t('step2Desc'),
        },
        {
            icon: Hammer,
            title: t('step3Title'),
            description: t('step3Desc'),
        },
        {
            icon: Home,
            title: t('step4Title'),
            description: t('step4Desc'),
        }
    ];

    return (
        <SectionWrapper className="bg-secondary/30">
            <SectionHeader
                title={t('title')}
                subtitle={t('subtitle')}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-orange-200 via-orange-400 to-orange-200 -z-10" />

                {STEPS.map((step, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.2 }}
                        className="flex flex-col items-center text-center space-y-4 bg-background p-6 rounded-xl shadow-sm border border-border/50 relative"
                    >
                        <div className="w-12 h-12 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/20 z-10">
                            <step.icon className="w-6 h-6" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold">{step.title}</h3>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>

                        {/* Step Number Background */}
                        <div className="absolute -top-4 -right-4 text-9xl font-bold text-muted/20 select-none pointer-events-none">
                            {idx + 1}
                        </div>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
