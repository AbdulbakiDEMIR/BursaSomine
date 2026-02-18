"use client";

import { Button } from '@/components/ui/button';
import ImageWithLoader from '@/components/ui/image-with-loader';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';

interface HeroProps {
    title: string;
    subtitle: string;
    ctaText: string;
    ctaLink?: string;
    contactText: string;
}

export default function Hero({ title, subtitle, ctaText, ctaLink = '/products', contactText }: HeroProps) {
    return (
        <section className="relative h-[100vh] w-full overflow-hidden flex items-center justify-center text-center md:text-left md:justify-start">
            {/* Background with Zoom Effect */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "easeOut" }}
                    className="relative w-full h-full"
                >
                    <ImageWithLoader
                        src="https://images.unsplash.com/photo-1542856391-010fb87dcfed?auto=format&fit=crop&q=80"
                        alt="Luxury Fireplace"
                        fill
                        className="object-cover brightness-[0.65]"
                        priority
                    />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            </div>

            {/* Content */}
            <div className="container relative z-10 px-4 md:px-6 text-white">
                <div className="max-w-3xl space-y-6">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl drop-shadow-lg"
                    >
                        {title}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg md:text-xl text-stone-100 font-light max-w-2xl"
                    >
                        {subtitle}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-4 pt-6 justify-center md:justify-start"
                    >
                        <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground border-0 shadow-xl transition-all" asChild>
                            <Link href={ctaLink as any}>{ctaText}</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm" asChild>
                            <Link href="/contact">{contactText}</Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
