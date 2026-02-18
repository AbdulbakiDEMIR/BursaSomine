"use client";

import { SectionWrapper } from '@/components/SectionWrapper';
import { motion } from 'framer-motion';
import { ICON_MAP } from '@/components/ui/icons';
import { Flame, ShieldCheck, Ruler } from 'lucide-react'; // Keep these for fallback if needed, or remove if unused

interface FeatureItem {
    title: string;
    description: string;
    icon?: string;
}

interface FeaturesProps {
    features: FeatureItem[];
}

const DEFAULT_ICON = Flame;

export default function Features({ features }: FeaturesProps) {
    return (
        <SectionWrapper className="relative bg-white overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                {features.map((feature, idx) => {
                    // Try to find the icon by name, otherwise fallback to existing round-robin or default
                    let Icon = DEFAULT_ICON;

                    if (feature.icon && ICON_MAP[feature.icon]) {
                        Icon = ICON_MAP[feature.icon];
                    } else {
                        // Fallback logic for legacy data without icon field
                        const fallbackIcons = [ShieldCheck, Ruler, Flame];
                        Icon = fallbackIcons[idx % fallbackIcons.length];
                    }

                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.2 }}
                            className="group flex flex-col items-center text-center space-y-4 p-8 rounded-2xl bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                        >
                            <div className="p-4 rounded-full bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-300">
                                <Icon className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-primary">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </motion.div>
                    );
                })}
            </div>
        </SectionWrapper>
    );
}
