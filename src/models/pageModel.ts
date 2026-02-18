import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { HomePageData, AboutPageData, FaqPageData } from '@/types';

const COLLECTION = 'pages';

export type PageId = 'home' | 'about' | 'faq';
export type PageData = HomePageData | AboutPageData | FaqPageData;

export const PageModel = {
    async getPage(pageId: PageId): Promise<PageData | null> {
        const ref = doc(db, COLLECTION, pageId);
        const snapshot = await getDoc(ref);
        if (!snapshot.exists()) return null;
        return snapshot.data() as PageData;
    },

    async updatePage(pageId: PageId, data: Partial<PageData>): Promise<void> {
        const ref = doc(db, COLLECTION, pageId);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
            await updateDoc(ref, data as Record<string, unknown>);
        } else {
            // Doküman yoksa oluştur
            await setDoc(ref, data);
        }
    },
};
