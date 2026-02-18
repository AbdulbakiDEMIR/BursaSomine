import { getTranslations } from 'next-intl/server';
import { SectionWrapper } from '@/components/SectionWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import { apiGetProducts, apiGetCategories } from '@/lib/apiClient';
import ProductsClient from './ProductsClient';

export default async function ProductsPage() {
    const t = await getTranslations('ProductsPage');

    const [products, categories] = await Promise.all([
        apiGetProducts(),
        apiGetCategories(),
    ]);

    return (
        <main className="min-h-screen pt-16">
            <SectionWrapper>
                <SectionHeader title={t('title')} subtitle={t('subtitle')} />
                <ProductsClient
                    products={products ?? []}
                    categories={categories ?? []}
                    labels={{
                        allProducts: t('allProducts'),
                        categories: t('categories'),
                        wood: t('wood'),
                        ethanol: t('ethanol'),
                        electric: t('electric'),
                        goToStore: t('goToStore'),
                        noProducts: t('noProducts'),
                    }}
                />
            </SectionWrapper>
        </main>
    );
}
