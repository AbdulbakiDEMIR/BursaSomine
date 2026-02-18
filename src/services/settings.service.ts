import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { SiteSettings } from "@/types";

const COLLECTION_NAME = "site_settings";
const DOC_ID = "general";

export const SettingsService = {
    // Ayarları getir
    getSettings: async () => {
        const docRef = doc(db, COLLECTION_NAME, DOC_ID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return docSnap.data() as SiteSettings;
        return null;
    },

    // Ayarları güncelle
    updateSettings: async (settings: Partial<SiteSettings>) => {
        const docRef = doc(db, COLLECTION_NAME, DOC_ID);
        await setDoc(docRef, settings, { merge: true });
        return true;
    }
};
