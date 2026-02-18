import { db } from "@/lib/firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy
} from "firebase/firestore";
import { Product } from "@/types";

const COLLECTION_NAME = "products";

export const ProductsService = {
    // Tüm ürünleri getir
    getAll: async () => {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    },

    // Kategoriye göre getir
    getByCategory: async (category: string) => {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("category", "==", category)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[];
    },

    // Tek bir ürün getir
    getById: async (id: string) => {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Product;
        } else {
            return null;
        }
    },

    // Yeni ürün ekle
    create: async (product: Omit<Product, "id">) => {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...product,
            createdAt: new Date().toISOString()
        });
        return { id: docRef.id, ...product };
    },

    // Ürün güncelle
    update: async (id: string, product: Partial<Product>) => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await updateDoc(docRef, product);
        return { id, ...product };
    },

    // Ürün sil
    delete: async (id: string) => {
        const docRef = doc(db, COLLECTION_NAME, id);
        await deleteDoc(docRef);
        return true;
    }
};
