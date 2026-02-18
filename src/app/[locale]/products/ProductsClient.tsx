"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ImageWithLoader from '@/components/ui/image-with-loader';
import { useLocale } from 'next-intl';
import { Product, Category } from '@/types';

interface Labels {
    allProducts: string;
    categories: string;
    wood: string;
    ethanol: string;
    electric: string;
    goToStore: string;
    noProducts: string;
}

interface ProductsClientProps {
    products: Product[];
    categories: Category[];
    labels: Labels;
}

const CATEGORY_LABELS: Record<string, keyof Labels> = {
    wood: 'wood',
    ethanol: 'ethanol',
    electric: 'electric',
};

export default function ProductsClient({ products, categories, labels }: ProductsClientProps) {
    const locale = useLocale() as 'tr' | 'en';
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const filtered = activeCategory
        ? products.filter((p) => p.category === activeCategory)
        : products;

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar / Filter */}
            <aside className="w-full md:w-64 space-y-6">
                <div>
                    <h3 className="font-semibold mb-4 text-lg">{labels.categories}</h3>
                    <ul className="space-y-2">
                        <li>
                            <Button
                                variant={activeCategory === null ? 'default' : 'ghost'}
                                className="w-full justify-start"
                                onClick={() => setActiveCategory(null)}
                            >
                                {labels.allProducts}
                            </Button>
                        </li>
                        {categories.map((cat) => (
                            <li key={cat.id}>
                                <Button
                                    variant={activeCategory === cat.id ? 'default' : 'ghost'}
                                    className="w-full justify-start"
                                    onClick={() => setActiveCategory(cat.id)}
                                >
                                    {cat.title[locale]}
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.length === 0 ? (
                    <p className="col-span-full text-center text-muted-foreground py-16">
                        {labels.noProducts}
                    </p>
                ) : (
                    filtered.map((product) => (
                        <div
                            key={product.id}
                            className="group flex flex-col border border-border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                        >
                            <div className="relative aspect-square overflow-hidden bg-secondary/20">
                                {product.images && product.images[0] ? (
                                    <ImageWithLoader
                                        src={product.images[0]}
                                        alt={product.name[locale]}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-secondary/30 text-muted-foreground text-sm">
                                        Görsel yok
                                    </div>
                                )}
                            </div>
                            <div className="p-5 flex flex-col flex-1">
                                <div className="mb-4">
                                    <h3 className="font-bold text-lg text-foreground mb-1">
                                        {product.name[locale]}
                                    </h3>
                                    <p className="text-muted-foreground text-sm capitalize">
                                        {labels[CATEGORY_LABELS[product.category] as keyof Labels]}
                                    </p>
                                    <p className="text-primary font-semibold mt-1">{product.price}</p>
                                </div>
                                <div className="mt-auto">
                                    <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm group-hover:shadow" asChild>
                                        <a href="https://magaza.bursasomine.com" target="_blank" rel="noopener noreferrer">
                                            {labels.goToStore}
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
