"use client";

import { SectionWrapper } from '@/components/SectionWrapper';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

interface ReviewItem {
    author: string;
    rating: number;
    date: string;
    text: string;
}

interface ReviewsSectionProps {
    title: string;
    subtitle: string;
    reviews: ReviewItem[];
    viewAllText: string;
    googleMapsUrl?: string;
}

export default function ReviewsSection({ title, subtitle, reviews, viewAllText, googleMapsUrl = 'https://www.google.com/maps' }: ReviewsSectionProps) {
    return (
        <SectionWrapper className="bg-white">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-primary mb-4">
                    {title}
                </h2>
                <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-2xl font-bold text-foreground">4.9</span>
                    <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                    </div>
                </div>
                <p className="text-muted-foreground">{subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {reviews.map((review, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: idx * 0.2 }}
                        className="bg-card p-6 rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {review.author.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-semibold text-foreground">{review.author}</h4>
                                <div className="flex text-yellow-500 text-xs">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} className="w-3 h-3 fill-current" />
                                    ))}
                                </div>
                            </div>
                            <span className="ml-auto text-xs text-muted-foreground">{review.date}</span>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            &ldquo;{review.text}&rdquo;
                        </p>
                    </motion.div>
                ))}
            </div>

            <div className="mt-10 text-center">
                <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline font-medium"
                >
                    {viewAllText} →
                </a>
            </div>
        </SectionWrapper>
    );
}
