import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/SectionWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { CATEGORIES } from '@/lib/data';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProcessSection from '@/components/ProcessSection';
import StatsSection from '@/components/StatsSection';
import FeaturedProjects from '@/components/FeaturedProjects';
import AboutSummary from '@/components/AboutSummary';
import InstagramFeed from '@/components/InstagramFeed';
import FAQSection from '@/components/FAQSection';
import ReviewsSection from '@/components/ReviewsSection';

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <main className="flex flex-col min-h-screen">

      <Hero />

      <StatsSection />

      <AboutSummary />

      <Features />

      <FeaturedProjects />

      <ReviewsSection />

      <ProcessSection />


      {/* Categories Section */}
      <SectionWrapper>
        <SectionHeader
          title="Ürün Koleksiyonumuz"
          subtitle="Mekanınıza en uygun şömine tipini keşfedin."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={cat.href} className="group relative block overflow-hidden rounded-xl aspect-[4/5] shadow-md transition-shadow hover:shadow-xl">
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
                <h3 className="text-3xl font-bold mb-3">{cat.title}</h3>
                <p className="text-stone-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">{cat.description}</p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  <span>İncele</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SectionWrapper>

      <FAQSection limit={3} />


      {/* CTA Section */}
      <SectionWrapper className="bg-primary text-primary-foreground text-center py-24 relative overflow-hidden">
        {/* Subtle pattern or gradient could go here */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Evinizin Havasını Değiştirmeye Hazır Mısınız?</h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Uzman ekibimizle görüşerek projeniz için en doğru seçimi yapın.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto" asChild>
            <Link href="/contact">Bize Ulaşın / Teklif Alın</Link>
          </Button>
        </div>
      </SectionWrapper>

      <InstagramFeed />
    </main>
  );
}
