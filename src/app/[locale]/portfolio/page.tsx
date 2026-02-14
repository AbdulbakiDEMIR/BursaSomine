import { SectionWrapper } from '@/components/SectionWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import Image from 'next/image';

const PROJECTS = [
    { id: 1, title: 'Villa Bademli', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80' },
    { id: 2, title: 'Ofis Lounge', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80' },
    { id: 3, title: 'Dağ Evi Projesi', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80' },
    { id: 4, title: 'Modern Daire', image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&q=80' },
    { id: 5, title: 'Restaurant Şömine', image: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&q=80' },
    { id: 6, title: 'Otel Lobisi', image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80' },
];

export default function PortfolioPage() {
    return (
        <main className="min-h-screen pt-16">
            <SectionWrapper>
                <SectionHeader title="Referanslarımız" subtitle="Tamamladığımız seçkin projelerden örnekler." />

                {/* Masonry-like Grid */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {PROJECTS.map((project) => (
                        <div key={project.id} className="break-inside-avoid relative group rounded-xl overflow-hidden shadow-md">
                            <Image
                                src={project.image}
                                alt={project.title}
                                width={600}
                                height={400}
                                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <h3 className="text-white text-xl font-bold">{project.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </SectionWrapper>
        </main>
    );
}
