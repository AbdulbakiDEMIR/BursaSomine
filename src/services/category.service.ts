import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
} from "firebase/firestore";
import { Category } from "@/types";

const COLLECTION_NAME = "categories";

export const CategoriesService = {
    // Tüm kategorileri getir
    getAll: async () => {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() // data contains title, description, image
        })) as Category[];
    },

    // Tek bir kategori getir
    getById: async (id: string) => {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Category;
        } else {
            return null;
        }
    }
};
