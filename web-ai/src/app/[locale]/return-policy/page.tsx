import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/SectionWrapper';

export default function ReturnPolicyPage() {
    const t = useTranslations('ReturnPolicy');

    return (
        <main className="min-h-screen pt-24 pb-16">
            <SectionWrapper>
                <div className="max-w-4xl mx-auto space-y-12">

                    {/* Header */}
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">{t('title')}</h1>
                        <p className="text-xl text-muted-foreground">{t('subtitle')}</p>
                    </div>

                    <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
                        <p className="lead">{t('intro')}</p>

                        <section>
                            <h2 className="text-2xl font-semibold text-primary mb-4">{t('timeTitle')}</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>{t('timeList1')}</li>
                                <li>{t('timeList2')}</li>
                                <li>{t('timeList3')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-primary mb-4">{t('conditionsTitle')}</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>{t('conditionsList1')}</li>
                                <li>{t('conditionsList2')}</li>
                                <li>{t('conditionsList3')}</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-primary mb-4">{t('processTitle')}</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p><strong className="text-foreground">{t('processRequestTitle')}</strong> {t('processRequestText')}</p>
                                <p><strong className="text-foreground">{t('processExchangeTitle')}</strong> {t('processExchangeText')}</p>
                                <p><strong className="text-foreground">{t('processShippingTitle')}</strong> {t('processShippingText')}</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-primary mb-4">{t('considerationsTitle')}</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p><strong className="text-foreground">{t('considerationsReturnTitle')}</strong> {t('considerationsReturnText')}</p>
                                <p><strong className="text-foreground">{t('considerationsExchangeTitle')}</strong> {t('considerationsExchangeText')}</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-primary mb-4">{t('exceptionsTitle')}</h2>
                            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                                <li>{t('exceptionsList1')}</li>
                                <li>{t('exceptionsList2')}</li>
                                <li>{t('exceptionsList3')}</li>
                            </ul>
                        </section>

                        <section className="bg-muted/50 p-6 rounded-lg border border-border">
                            <h2 className="text-2xl font-semibold text-primary mb-4">{t('warrantyTitle')}</h2>
                            <div className="space-y-4 text-muted-foreground">
                                <p>{t('warrantyText1')}</p>
                                <p>{t('warrantyText2')}</p>
                            </div>
                        </section>

                    </div>
                </div>
            </SectionWrapper>
        </main>
    );
}
