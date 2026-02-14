"use client";

import { SectionWrapper } from '@/components/SectionWrapper';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { Link } from '@/i18n/routing';

const INSTAGRAM_POSTS = [
    { id: 1, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80', link: 'https://www.instagram.com/bursa.somine/' },
    { id: 2, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80', link: 'https://www.instagram.com/bursa.somine/' },
    { id: 3, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80', link: 'https://www.instagram.com/bursa.somine/' },
    { id: 4, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80', link: 'https://www.instagram.com/bursa.somine/' },
    { id: 5, image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80', link: 'https://www.instagram.com/bursa.somine/' },
    { id: 6, image: 'https://images.unsplash.com/photo-1606103323062-8411b0b5550a?auto=format&fit=crop&q=80', link: 'https://www.instagram.com/bursa.somine/' },
];

export default function InstagramFeed() {
    return (
        <SectionWrapper>
            <div className="flex flex-col items-center mb-10 text-center">
                <div className="p-3 bg-pink-100 rounded-full text-pink-600 mb-4">
                    <Instagram className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary mb-2">Bizi Instagram'da Takip Edin</h2>
                <p className="text-lg text-muted-foreground mb-6">En yeni projelerimiz ve ilham veren tasarımlarımız için @bursa.somine</p>

                <Button variant="outline" className="gap-2" asChild>
                    <a href="https://www.instagram.com/bursa.somine/" target="_blank" rel="noopener noreferrer">
                        Hemen Takip Et <span className="text-xs ml-1">→</span>
                    </a>
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {INSTAGRAM_POSTS.map((post, idx) => (
                    <motion.a
                        key={post.id}
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.1 }}
                        className="group relative aspect-square overflow-hidden rounded-lg bg-muted block"
                    >
                        <Image
                            src={post.image}
                            alt="Instagram Post"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Instagram className="w-8 h-8 text-white" />
                        </div>
                    </motion.a>
                ))}
            </div>
        </SectionWrapper>
    );
}
