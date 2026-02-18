import FAQSection from '../../../components/FAQSection';
import { getTranslations } from 'next-intl/server';
import { getBaseUrl } from '@/lib/utils'; // Make sure this utility exists or use a direct fetch
import { notFound } from 'next/navigation';

async function getFaqs() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/pages/faq`, {
            next: { tags: ['faq'] },
            cache: 'no-store'
        });
        if (!res.ok) return null;
        const json = await res.json();
        return json.data;
    } catch (error) {
        return null;
    }
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations('FAQ');
    const faqData = await getFaqs();

    if (!faqData || !faqData.faqs) {
        // Handle empty state or error if needed
    }

    return (
        <main className="min-h-screen pt-16">
            <FAQSection
                locale={locale as 'tr' | 'en'}
                faqs={faqData?.faqs || []}
                title={faqData?.title?.[locale as 'tr' | 'en'] || t('title')}
                subtitle={faqData?.subtitle?.[locale as 'tr' | 'en'] || t('subtitle')}
                viewAllText={t('viewAll')}
            />
        </main>
    );
}
