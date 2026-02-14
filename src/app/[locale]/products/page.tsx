import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/SectionWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// Extended mock product data
const PRODUCTS = [
    { id: 1, name: "Klasik Odunlu Şömine", category: "wood", price: "25.000 TL", image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&q=80" },
    { id: 2, name: "Modern Etanollü Model", category: "ethanol", price: "18.500 TL", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&q=80" },
    { id: 3, name: "Panoramik Elektrikli", category: "electric", price: "12.000 TL", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80" },
    // Duplicates for grid demo
    { id: 4, name: "Rustik Odunlu", category: "wood", price: "28.000 TL", image: "https://images.unsplash.com/photo-1496417206111-c6e268c12f27?auto=format&fit=crop&q=80" },
    { id: 5, name: "Masaüstü Etanollü", category: "ethanol", price: "4.500 TL", image: "https://images.unsplash.com/photo-1510672981848-a1c4f1cb5ccf?auto=format&fit=crop&q=80" },
    { id: 6, name: "Gömme Elektrikli", category: "electric", price: "15.000 TL", image: "https://images.unsplash.com/photo-1520697830682-bbb6e85e2b0b?auto=format&fit=crop&q=80" },
];

export default function ProductsPage() {
    const t = useTranslations('Navigation');

    return (
        <main className="min-h-screen pt-16">
            <SectionWrapper>
                <SectionHeader title="Ürünlerimiz" subtitle="Evinize sıcaklık katacak özel tasarımlarımız." />

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / Filter (Simple implementation) */}
                    <aside className="w-full md:w-64 space-y-6">
                        <div>
                            <h3 className="font-semibold mb-4 text-lg">Kategoriler</h3>
                            <ul className="space-y-2">
                                <li><Button variant="ghost" className="w-full justify-start">Tüm Ürünler</Button></li>
                                <li><Button variant="ghost" className="w-full justify-start">Odunlu</Button></li>
                                <li><Button variant="ghost" className="w-full justify-start">Etanollü</Button></li>
                                <li><Button variant="ghost" className="w-full justify-start">Elektrikli</Button></li>
                            </ul>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {PRODUCTS.map((product) => (
                            <div key={product.id} className="group flex flex-col border border-border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
                                <div className="relative aspect-square overflow-hidden bg-secondary/20">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <h3 className="font-bold text-lg text-foreground mb-1">{product.name}</h3>
                                        <p className="text-muted-foreground text-sm capitalize">{product.category}</p>
                                    </div>

                                    <div className="mt-auto">
                                        <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-sm group-hover:shadow" asChild>
                                            <a href="https://magaza.bursasomine.com" target="_blank" rel="noopener noreferrer">
                                                Online Mağazaya Git
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SectionWrapper>
        </main>
    );
}
