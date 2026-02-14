import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/SectionWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
    const t = useTranslations('ContactPage');

    return (
        <main className="min-h-screen pt-16">
            <SectionWrapper>
                <SectionHeader title={t('title')} subtitle={t('subtitle')} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">{t('addressTitle')}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Bursa Şömine Fabrikası<br />
                                {t('address')}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">{t('contactChannels')}</h3>
                            <div className="space-y-2 text-muted-foreground">
                                <p>{t('phone')}: +90 (224) 123 45 67</p>
                                <p>{t('email')}: info@bursasomine.com</p>
                                <p>{t('hours')}</p>
                            </div>
                        </div>

                        <div className="h-64 bg-muted rounded-lg flex items-center justify-center border border-border">
                            <span className="text-muted-foreground">Google Maps Harita Alanı</span>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-background p-8 rounded-lg border border-border shadow-sm">
                        <h3 className="text-xl font-bold mb-6">{t('formTitle')}</h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">{t('labelName')}</label>
                                    <Input id="name" placeholder={t('holderName')} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">{t('labelPhone')}</label>
                                    <Input id="phone" placeholder={t('holderPhone')} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">{t('labelEmail')}</label>
                                <Input id="email" type="email" placeholder={t('holderEmail')} />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">{t('labelMessage')}</label>
                                <Textarea id="message" placeholder={t('holderMessage')} className="min-h-[120px]" />
                            </div>

                            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                                {t('submit')}
                            </Button>
                        </form>
                    </div>

                </div>
            </SectionWrapper>
        </main>
    );
}
