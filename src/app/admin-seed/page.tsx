"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, writeBatch } from "firebase/firestore";
import trData from "../../../messages/tr.json"; // Türkçe veriler
import enData from "../../../messages/en.json"; // İngilizce veriler
import { CATEGORIES, FEATURES } from "@/lib/data"; // data.ts (Genelde sadece Türkçe olur, manuel işleyeceğiz)

export default function SeedPage() {
    const [status, setStatus] = useState("Bekleniyor...");
    const [loading, setLoading] = useState(false);

    const seedDatabase = async () => {
        setLoading(true);
        setStatus("Başlıyor...");

        try {
            const batch = writeBatch(db);

            // --- 1. AYARLAR (Site Settings) ---
            const settingsRef = doc(db, "site_settings", "general");
            batch.set(settingsRef, {
                brandName: "Bursa Şömine",
                contact: {
                    address: trData.ContactPage.address, // Adres genelde çevrilmez ama gerekirse {tr:..., en:...} yapılabilir
                    phone: trData.ContactPage.holderPhone,
                    email: trData.ContactPage.holderEmail,
                    hours: {
                        tr: trData.ContactPage.hours,
                        en: enData.ContactPage.hours
                    },
                },
                socialMedia: {
                    instagram: "https://instagram.com/bursa.somine",
                }
            });

            // --- 2. SAYFALAR (Pages) ---

            // ANASAYFA
            const homeRef = doc(db, "pages", "home");
            batch.set(homeRef, {
                hero: {
                    title: { tr: trData.HomePage.heroTitle, en: enData.HomePage.heroTitle },
                    subtitle: { tr: trData.HomePage.heroSubtitle, en: enData.HomePage.heroSubtitle },
                    ctaText: { tr: trData.HomePage.cta, en: enData.HomePage.cta },
                },
                stats: {
                    // İstatistik başlıkları
                    yearsLabel: { tr: trData.HomePage.stats.years, en: enData.HomePage.stats.years },
                    projectsLabel: { tr: trData.HomePage.stats.projects, en: enData.HomePage.stats.projects },
                    satisfactionLabel: { tr: trData.HomePage.stats.satisfaction, en: enData.HomePage.stats.satisfaction },
                    citiesLabel: { tr: trData.HomePage.stats.cities, en: enData.HomePage.stats.cities },
                    // Değerler (Sayısal olduğu için tek)
                    yearsValue: 34,
                    projectsValue: 500,
                    satisfactionValue: 100,
                    citiesValue: 81
                },
                // Features (Özellikler) - data.ts'den geliyor ama en.json'dan eşleştirmeye çalışacağız
                features: FEATURES.map((f, i) => {
                    // en.json içinde features array olmadığı için manuel veya tr ile aynı yapıyoruz.
                    // İstersen burayı elle İngilizceye çevirip yazabilirsin.
                    // Şimdilik İngilizce kısmına [EN] etiketi ekliyorum, panelden düzenlersin.
                    return {
                        title: { tr: f.title, en: f.title + " (EN)" },
                        description: { tr: f.description, en: f.description + " (EN)" }
                    };
                })
            });

            // HAKKIMIZDA
            const aboutRef = doc(db, "pages", "about");
            batch.set(aboutRef, {
                history: { tr: trData.AboutPage.historyText1, en: enData.AboutPage.historyText1 },
                vision: { tr: trData.AboutPage.visionText, en: enData.AboutPage.visionText },
                mission: {
                    tr: [trData.AboutPage.mission1, trData.AboutPage.mission2, trData.AboutPage.mission3],
                    en: [enData.AboutPage.mission1, enData.AboutPage.mission2, enData.AboutPage.mission3]
                }
            });

            // --- 3. KATEGORİLER (Categories) ---
            // data.ts içindeki veriyi kullanıyoruz. 
            // data.ts sadece Türkçe olduğu için İngilizce kısımları messages/en.json'dan çekmeye çalışacağız.
            const enCategories = enData.HomePage.categories.items;

            CATEGORIES.forEach((cat) => {
                const catRef = doc(db, "categories", cat.id);

                // en.json'da bu kategori var mı diye id ile kontrol ediyoruz (wood, ethanol, electric)
                // @ts-ignore
                const enCat = enCategories[cat.id] || {};

                batch.set(catRef, {
                    title: { tr: cat.title, en: enCat.title || cat.title },
                    description: { tr: cat.description, en: enCat.description || cat.description },
                    image: cat.image,
                    id: cat.id
                });
            });

            // --- 4. ÜRÜNLER (Products) ---
            // tr.json'daki ürünleri baz alıp en.json ile birleştiriyoruz.
            Object.entries(trData.ProductsPage.items).forEach(([key, item]) => {
                const prodRef = doc(db, "products", `product-${key}`);

                // Aynı key ile İngilizce verisini buluyoruz
                // @ts-ignore
                const enItem = enData.ProductsPage.items[key] || {};

                // Kategori tahmini
                let catId = "electric";
                if (item.name.toLowerCase().includes("odun")) catId = "wood";
                if (item.name.toLowerCase().includes("etanol")) catId = "ethanol";

                batch.set(prodRef, {
                    name: { tr: item.name, en: enItem.name || item.name },
                    price: item.price,
                    category: catId,
                    // Açıklama json'da yoktu, placeholder koyuyoruz
                    description: { tr: "Ürün açıklaması...", en: "Product description..." },
                    isFeatured: true,
                    createdAt: new Date().toISOString()
                });
            });

            // --- 5. SSS (FAQ) ---
            const faqRef = doc(db, "pages", "faq");
            const faqs = [];
            for (let i = 1; i <= 9; i++) {
                // @ts-ignore
                if (trData.FAQ[`q${i}`]) {
                    faqs.push({
                        question: {
                            // @ts-ignore
                            tr: trData.FAQ[`q${i}`],
                            // @ts-ignore
                            en: enData.FAQ[`q${i}`] || trData.FAQ[`q${i}`]
                        },
                        answer: {
                            // @ts-ignore
                            tr: trData.FAQ[`a${i}`],
                            // @ts-ignore
                            en: enData.FAQ[`a${i}`] || trData.FAQ[`a${i}`]
                        }
                    });
                }
            }
            batch.set(faqRef, { faqs: faqs });

            await batch.commit();
            setStatus("BAŞARILI! Çift dilli veriler Firebase'e yüklendi. 🇹🇷 🇬🇧");
        } catch (error) {
            console.error(error);
            setStatus("HATA: " + error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <div className="p-8 bg-white rounded-xl shadow-lg text-center max-w-md">
                <h1 className="text-2xl font-bold mb-2 text-gray-800">Çift Dilli Veritabanı Kurulumu</h1>
                <p className="mb-6 text-gray-600 text-sm">TR ve EN json dosyalarını birleştirip Firebase'e yükler.</p>

                <button
                    onClick={seedDatabase}
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Yükleniyor..." : "Veritabanını Kur (TR/EN) 🚀"}
                </button>

                {status && (
                    <div className={`mt-6 p-4 rounded-lg text-sm font-medium ${status.includes("HATA") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
}