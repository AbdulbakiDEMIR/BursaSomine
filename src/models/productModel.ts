import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';

const COLLECTION = 'products';

export const ProductModel = {
    async getAll(): Promise<Product[]> {
        const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
    },

    async getById(id: string): Promise<Product | null> {
        const ref = doc(db, COLLECTION, id);
        const snapshot = await getDoc(ref);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as Product;
    },

    async create(data: Omit<Product, 'id'>): Promise<Product> {
        const ref = await addDoc(collection(db, COLLECTION), data);
        return { id: ref.id, ...data };
    },

    async update(id: string, data: Partial<Omit<Product, 'id'>>): Promise<void> {
        const ref = doc(db, COLLECTION, id);
        await updateDoc(ref, data as Record<string, unknown>);
    },

    async delete(id: string): Promise<void> {
        const ref = doc(db, COLLECTION, id);
        await deleteDoc(ref);
    },
};
