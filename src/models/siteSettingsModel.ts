import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { SiteSettings } from '@/types';

const COLLECTION = 'site_settings';
const DOC_ID = 'general';

export const SiteSettingsModel = {
    async get(): Promise<SiteSettings | null> {
        const ref = doc(db, COLLECTION, DOC_ID);
        const snapshot = await getDoc(ref);
        if (!snapshot.exists()) return null;
        return snapshot.data() as SiteSettings;
    },

    async update(data: Partial<SiteSettings>): Promise<void> {
        const ref = doc(db, COLLECTION, DOC_ID);
        const snapshot = await getDoc(ref);
        if (snapshot.exists()) {
            await updateDoc(ref, data as Record<string, unknown>);
        } else {
            await setDoc(ref, data);
        }
    },
};
