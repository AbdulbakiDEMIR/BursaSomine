import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import { apiGetFaqPage } from '@/lib/apiClient';
import FAQSection from '@/components/FAQSection';

export default async function FAQPage() {
    const t = await getTranslations('FAQ');
    const locale = (await getLocale()) as 'tr' | 'en';
    const faqData = await apiGetFaqPage();

    return (
        <main className="min-h-screen pt-16">
            <FAQSection
                faqs={faqData?.faqs ?? []}
                locale={locale}
                title={t('title')}
                subtitle={t('subtitle')}
                viewAllText={t('viewAll')}
            />
        </main>
    );
}
