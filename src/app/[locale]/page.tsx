import { getTranslations } from 'next-intl/server';
import { SectionWrapper } from '@/components/SectionWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
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
import ImageWithLoader from '@/components/ui/image-with-loader';
import { apiGetProducts, apiGetCategories, apiGetFaqPage, apiGetHomePage, apiGetAboutPage, apiGetProjects } from '@/lib/apiClient';
import { Category } from '@/types';
import { getLocale } from 'next-intl/server';
import SelectedProjects from '@/components/SelectedProjects';

export default async function Home() {
  const t = await getTranslations('HomePage');
  const tAbout = await getTranslations('AboutPage');
  const tReviews = await getTranslations('Reviews');
  const tFaq = await getTranslations('FAQ');
  const locale = (await getLocale()) as 'tr' | 'en';

  // API'den tüm verileri paralel olarak çek
  const [homeData, aboutData, products, faqData, categories, allProjects] = await Promise.all([
    apiGetHomePage(),
    apiGetAboutPage(),
    apiGetProducts(),
    apiGetFaqPage(),
    apiGetCategories(),
    apiGetProjects(),
  ]);

  // Selected Projects Logic
  const selectedProjectIds = homeData?.selectedProjects || [];
  const selectedProjects = (allProjects || []).filter(p => selectedProjectIds.includes(p.id!));

  // Featured Products Logic
  const featuredProductIds = homeData?.featuredProducts?.selectedProductIds || [];
  const MANUAL_SELECTION_ACTIVE = featuredProductIds.length > 0;

  const featuredProducts = MANUAL_SELECTION_ACTIVE
    ? (products || []).filter(p => featuredProductIds.includes(p.id!))
    : (products || []).filter(p => p.isFeatured).slice(0, 3);

  const featuredTitle = homeData?.featuredProducts?.title?.[locale] || t('featuredProjects.title');
  const featuredSubtitle = homeData?.featuredProducts?.subtitle?.[locale] || t('featuredProjects.subtitle');

  // Hero verileri
  const heroTitle = homeData?.hero?.title?.[locale] ?? t('heroTitle');
  const heroSubtitle = homeData?.hero?.subtitle?.[locale] ?? t('heroSubtitle');

  // Stats verileri
  const stats = homeData?.stats
    ? [
      { value: `${homeData.stats.yearsValue}`, label: homeData.stats.yearsLabel[locale] },
      { value: `${homeData.stats.projectsValue}`, label: homeData.stats.projectsLabel[locale] },
      { value: `${homeData.stats.satisfactionValue}`, label: homeData.stats.satisfactionLabel[locale] },
      { value: `${homeData.stats.citiesValue}`, label: homeData.stats.citiesLabel[locale] },
    ]
    : [
      { value: '20+', label: t('stats.years') },
      { value: '500+', label: t('stats.projects') },
      { value: '%100', label: t('stats.satisfaction') },
      { value: '81', label: t('stats.cities') },
    ];

  // Features verileri
  const features = homeData?.features
    ? homeData.features.map((f) => ({
      title: f.title[locale],
      description: f.description[locale],
      icon: f.icon,
    }))
    : [
      { title: t('features.qualityTitle'), description: t('features.qualityDesc') },
      { title: t('features.designTitle'), description: t('features.designDesc') },
      { title: t('features.installTitle'), description: t('features.installDesc') },
    ];

  return (
    <main className="flex flex-col min-h-screen">

      <Hero
        title={heroTitle}
        subtitle={heroSubtitle}
        ctaText={t('cta')}
        contactText={t('contactBtn')}
      />

      <StatsSection stats={stats} />

      <AboutSummary
        title={homeData?.about?.title?.[locale] ?? tAbout('title')}
        historyText={homeData?.about?.description?.[locale] ?? aboutData?.history?.[locale] ?? tAbout('historyText1')}
        philosophyText={homeData?.about?.philosophy?.[locale] ?? aboutData?.vision?.[locale] ?? tAbout('philosophyText')}
        learnMore={tAbout('learnMore')}
        since={homeData?.about?.sinceDate?.[locale] ?? tAbout('since')}
        tagline={homeData?.about?.tagline?.[locale] ?? tAbout('tagline')}
      />

      <Features features={features} />

      {/* Selected Projects - Admin'den seçilen projeler */}
      <SelectedProjects
        projects={selectedProjects}
        locale={locale}
        title={t('featuredProjects.title')} // Using same translation key for now or could be specific
        subtitle={t('featuredProjects.subtitle')}
        viewAllText={t('featuredProjects.viewAll')}
      />

      {/* FeaturedProjects — API'den gelen isFeatured ürünleri (Optional: Keep or Remove based on preference, keeping for now as they are Products not Projects) */}
      <FeaturedProjects
        products={featuredProducts}
        locale={locale}
        title={featuredTitle}
        subtitle={featuredSubtitle}
        viewAllText={t('featuredProjects.viewAll')}
      />

      <ReviewsSection
        title={tReviews('title')}
        subtitle={tReviews('subtitle')}
        reviews={[
          { author: 'Ahmet Yılmaz', rating: 5, date: tReviews('date1'), text: tReviews('review1') },
          { author: 'Zeynep Kaya', rating: 5, date: tReviews('date2'), text: tReviews('review2') },
          { author: 'Murat Demir', rating: 5, date: tReviews('date3'), text: tReviews('review3') },
        ]}
        viewAllText={tReviews('viewAll')}
      />

      <ProcessSection
        title={t('process.title')}
        subtitle={t('process.subtitle')}
        steps={[
          { title: t('process.step1Title'), description: t('process.step1Desc') },
          { title: t('process.step2Title'), description: t('process.step2Desc') },
          { title: t('process.step3Title'), description: t('process.step3Desc') },
          { title: t('process.step4Title'), description: t('process.step4Desc') },
        ]}
      />

      {/* Categories Section — API'den gelen kategoriler */}
      <SectionWrapper>
        <SectionHeader
          title={t('categories.title')}
          subtitle={t('categories.subtitle')}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(categories ?? []).map((cat: Category) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.id}` as any}
              className="group relative block overflow-hidden rounded-xl aspect-[4/5] shadow-md transition-shadow hover:shadow-xl"
            >
              <ImageWithLoader
                src={cat.image}
                alt={cat.title[locale]}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 p-8 text-white transform transition-transform duration-300 group-hover:-translate-y-2">
                <h3 className="text-3xl font-bold mb-3">{cat.title[locale]}</h3>
                <p className="text-stone-200 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                  {cat.description[locale]}
                </p>
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
                  <span>{t('categories.view')}</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SectionWrapper>

      {/* FAQSection — API'den gelen SSS verileri */}
      <FAQSection
        limit={3}
        faqs={faqData?.faqs ?? []}
        locale={locale}
        title={tFaq('title')}
        subtitle={tFaq('subtitle')}
        viewAllText={tFaq('viewAll')}
      />

      {/* CTA Section */}
      <SectionWrapper className="bg-primary text-primary-foreground text-center py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t('ctaSection.title')}</h2>
          <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            {t('ctaSection.subtitle')}
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto" asChild>
            <Link href="/contact">{t('ctaSection.button')}</Link>
          </Button>
        </div>
      </SectionWrapper>

      <InstagramFeed
        title={t('instagram.title')}
        subtitle={t('instagram.subtitle')}
        followText={t('instagram.follow')}
      />
    </main>
  );
}
