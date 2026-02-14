"use client";

import { SectionWrapper } from '@/components/SectionWrapper';
import { motion } from 'framer-motion';

const STATS = [
    { value: "20+", label: "Yıllık Tecrübe" },
    { value: "500+", label: "Tamamlanan Proje" },
    { value: "%100", label: "Müşteri Memnuniyeti" },
    { value: "81", label: "İle Hizmet" },
];

export default function StatsSection() {
    return (
        <SectionWrapper className="bg-primary text-primary-foreground py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-primary-foreground/10 text-center">
                {STATS.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="flex flex-col items-center space-y-2 px-4"
                    >
                        <span className="text-4xl md:text-5xl font-bold text-primary-foreground/90">{stat.value}</span>
                        <span className="text-sm md:text-base text-primary-foreground/60 font-medium">{stat.label}</span>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
