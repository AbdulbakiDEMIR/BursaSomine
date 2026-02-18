"use client";

import { useState } from 'react';
import { SectionWrapper } from '@/components/SectionWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

interface FaqItem {
    question: { tr: string; en: string };
    answer: { tr: string; en: string };
}

interface FAQSectionProps {
    limit?: number;
    faqs?: FaqItem[];
    locale: 'tr' | 'en';
    title: string;
    subtitle: string;
    viewAllText: string;
}

export default function FAQSection({ limit, faqs = [], locale, title, subtitle, viewAllText }: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const visibleFaqs = limit ? faqs.slice(0, limit) : faqs;

    if (visibleFaqs.length === 0) return null;

    return (
        <SectionWrapper className="bg-secondary/30">
            <SectionHeader title={title} subtitle={subtitle} />

            <div className="max-w-3xl mx-auto mb-10">
                {visibleFaqs.map((faq, index) => (
                    <div key={index} className="border-b border-border last:border-0">
                        <button
                            onClick={() => toggleAccordion(index)}
                            className="flex items-center justify-between w-full py-6 text-left focus:outline-none group"
                            aria-expanded={openIndex === index}
                        >
                            <span className={cn(
                                "text-lg font-medium transition-colors duration-300",
                                openIndex === index ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                            )}>
                                {faq.question[locale]}
                            </span>
                            <span className={cn(
                                "flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300",
                                openIndex === index
                                    ? "bg-primary border-primary text-primary-foreground rotate-180"
                                    : "border-border text-muted-foreground group-hover:border-primary group-hover:text-primary"
                            )}>
                                {openIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                            </span>
                        </button>
                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <p className="pb-6 text-muted-foreground leading-relaxed">
                                        {faq.answer[locale]}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>

            {limit && (
                <div className="text-center">
                    <Button variant="outline" asChild>
                        <Link href="/faq" className="group">
                            {viewAllText} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            )}
        </SectionWrapper>
    );
}
