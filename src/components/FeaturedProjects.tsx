"use client";

import { SectionWrapper } from '@/components/SectionWrapper';
import { Button } from '@/components/ui/button';
import ImageWithLoader from '@/components/ui/image-with-loader';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Product } from '@/types';

interface FeaturedProjectsProps {
    products: Product[];
    locale: 'tr' | 'en';
    title: string;
    subtitle: string;
    viewAllText: string;
}

export default function FeaturedProjects({ products, locale, title, subtitle, viewAllText }: FeaturedProjectsProps) {
    const featured = products.filter((p) => p.isFeatured).slice(0, 3);

    if (featured.length === 0) return null;

    return (
        <SectionWrapper className="bg-secondary/30">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary">{title}</h2>
                    <p className="text-lg text-muted-foreground">{subtitle}</p>
                </div>
                <Button variant="outline" asChild className="hidden md:inline-flex">
                    <Link href="/portfolio" className="group">
                        {viewAllText} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featured.map((product, idx) => (
                    <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.2 }}
                        className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-white"
                    >
                        {product.images && product.images[0] ? (
                            <ImageWithLoader
                                src={product.images[0]}
                                alt={product.name[locale]}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full bg-secondary/30" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                        <div className="absolute bottom-0 left-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                            <p className="text-sm font-medium text-accent mb-1 capitalize">{product.category}</p>
                            <h3 className="text-xl font-bold">{product.name[locale]}</h3>
                            <p className="text-sm text-white/80 mt-1">{product.price}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 text-center md:hidden">
                <Button variant="outline" asChild>
                    <Link href="/portfolio">{viewAllText}</Link>
                </Button>
            </div>
        </SectionWrapper>
    );
}
