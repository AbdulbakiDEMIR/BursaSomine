import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { HomePageData, AboutPageData, FaqPageData } from "@/types";

const COLLECTION_NAME = "pages";

export const PagesService = {
    // Anasayfa verilerini getir
    getHomePageData: async () => {
        const docRef = doc(db, COLLECTION_NAME, "home");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return docSnap.data() as HomePageData;
        return null;
    },

    // Hakkımızda verilerini getir
    getAboutPageData: async () => {
        const docRef = doc(db, COLLECTION_NAME, "about");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return docSnap.data() as AboutPageData;
        return null;
    },

    // SSS verilerini getir
    getFaqPageData: async () => {
        const docRef = doc(db, COLLECTION_NAME, "faq");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return docSnap.data() as FaqPageData;
        return null;
    },

    // Sayfa verisi güncelle (Genel kullanım)
    updatePageData: async (pageId: string, data: any) => {
        const docRef = doc(db, COLLECTION_NAME, pageId);
        await setDoc(docRef, data, { merge: true });
        return true;
    }
};
