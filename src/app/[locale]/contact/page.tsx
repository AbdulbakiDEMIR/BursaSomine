import { useTranslations } from 'next-intl';
import { SectionWrapper } from '@/components/SectionWrapper';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
    const t = useTranslations('Navigation');

    return (
        <main className="min-h-screen pt-16">
            <SectionWrapper>
                <SectionHeader title="İletişim" subtitle="Projeleriniz için bizimle iletişime geçin." />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">Adres Bilgileri</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Bursa Şömine Fabrikası<br />
                                Organize Sanayi Bölgesi, Mavi Cadde No: 12<br />
                                Nilüfer / BURSA
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold mb-4">İletişim Kanalları</h3>
                            <div className="space-y-2 text-muted-foreground">
                                <p>Telefon: +90 (224) 123 45 67</p>
                                <p>E-posta: info@bursasomine.com</p>
                                <p>Çalışma Saatleri: Pzt-Cmt 09:00 - 18:00</p>
                            </div>
                        </div>

                        <div className="h-64 bg-muted rounded-lg flex items-center justify-center border border-border">
                            <span className="text-muted-foreground">Google Maps Harita Alanı</span>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-background p-8 rounded-lg border border-border shadow-sm">
                        <h3 className="text-xl font-bold mb-6">Bize Mesaj Gönderin</h3>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium">Adınız</label>
                                    <Input id="name" placeholder="Adınız Soyadınız" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium">Telefon</label>
                                    <Input id="phone" placeholder="0555 555 55 55" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium">E-posta</label>
                                <Input id="email" type="email" placeholder="ornek@email.com" />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium">Mesajınız</label>
                                <Textarea id="message" placeholder="Projenizden bahsedin..." className="min-h-[120px]" />
                            </div>

                            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                                Gönder
                            </Button>
                        </form>
                    </div>

                </div>
            </SectionWrapper>
        </main>
    );
}
