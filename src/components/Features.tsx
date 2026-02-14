"use client";

import { SectionWrapper } from '@/components/SectionWrapper';
import { motion } from 'framer-motion';
import { Flame, ShieldCheck, Ruler } from 'lucide-react';

const FEATURES = [
    {
        icon: ShieldCheck,
        title: 'Üstün Kalite',
        description: 'En dayanıklı malzemelerle uzun ömürlü kullanım garantisi sunuyoruz.',
    },
    {
        icon: Ruler,
        title: 'Özel Tasarım',
        description: 'Mekanınıza özel ölçü ve tasarım seçenekleri ile hayalinizdeki şömineyi üretiyoruz.',
    },
    {
        icon: Flame,
        title: 'Profesyonel Montaj',
        description: 'Uzman ekibimizle hızlı ve güvenli kurulum hizmeti sağlıyoruz.',
    }
];

export default function Features() {
    return (
        <SectionWrapper className="relative bg-muted/30 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {FEATURES.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.2 }}
                        className="group flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                    >
                        <div className="p-4 rounded-full bg-orange-100/50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                            <feature.icon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-primary">{feature.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
}
