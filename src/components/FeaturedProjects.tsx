"use client";

import { SectionWrapper } from '@/components/SectionWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const FEATURED_PROJECTS = [
    {
        id: 1,
        title: 'Villa Bademli',
        category: 'Modern Odunlu',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80'
    },
    {
        id: 2,
        title: 'Ofis Lounge',
        category: 'Etanol Tasarım',
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80'
    },
    {
        id: 3,
        title: 'Dağ Evi Projesi',
        category: 'Rustik Taş',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80'
    },
];

export default function FeaturedProjects() {
    return (
        <SectionWrapper>
            <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary">Seçkin Projelerimiz</h2>
                    <p className="text-lg text-muted-foreground">İlham veren son çalışmalarımızdan bazıları.</p>
                </div>
                <Button variant="outline" asChild className="hidden md:inline-flex">
                    <Link href="/portfolio" className="group">
                        Tümünü Gör <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FEATURED_PROJECTS.map((project, idx) => (
                    <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.2 }}
                        className="group relative aspect-[4/3] overflow-hidden rounded-xl bg-muted"
                    >
                        <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute bottom-0 left-0 p-6 text-white translate-y-2 group-hover:translate-y-0 transition-transform">
                            <p className="text-sm font-medium text-orange-400 mb-1">{project.category}</p>
                            <h3 className="text-xl font-bold">{project.title}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 text-center md:hidden">
                <Button variant="outline" asChild>
                    <Link href="/portfolio">Tümünü Gör</Link>
                </Button>
            </div>
        </SectionWrapper>
    );
}
