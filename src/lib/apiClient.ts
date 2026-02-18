/**
 * API İstemci Servisi
 * Sayfalar bu servis aracılığıyla /api/* endpoint'lerinden veri çeker.
 * Server Component'lerde absolute URL gerektiği için BASE_URL kullanılır.
 */

import { Product, Category, HomePageData, AboutPageData, FaqPageData, SiteSettings } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:3000');

async function apiFetch<T>(path: string): Promise<T | null> {
    try {
        const res = await fetch(`${BASE_URL}${path}`, {
            // Her istekte taze veri al (ISR için { next: { revalidate: 60 } } kullanılabilir)
            cache: 'no-store',
        });
        if (!res.ok) return null;
        const json = await res.json();
        if (!json.success) return null;
        return json.data as T;
    } catch (err) {
        console.error(`[apiClient] Fetch error for ${path}:`, err);
        return null;
    }
}

// --- Products ---
export const apiGetProducts = () => apiFetch<Product[]>('/api/products');
export const apiGetProduct = (id: string) => apiFetch<Product>(`/api/products/${id}`);

// --- Categories ---
export const apiGetCategories = () => apiFetch<Category[]>('/api/categories');
export const apiGetCategory = (id: string) => apiFetch<Category>(`/api/categories/${id}`);

// --- Pages ---
export const apiGetHomePage = () => apiFetch<HomePageData>('/api/pages/home');
export const apiGetAboutPage = () => apiFetch<AboutPageData>('/api/pages/about');
export const apiGetFaqPage = () => apiFetch<FaqPageData>('/api/pages/faq');

// --- Site Settings ---
export const apiGetSiteSettings = () => apiFetch<SiteSettings>('/api/site-settings');
