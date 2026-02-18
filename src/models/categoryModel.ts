import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/types';

const COLLECTION = 'categories';

export const CategoryModel = {
    async getAll(): Promise<Category[]> {
        const snapshot = await getDocs(collection(db, COLLECTION));
        return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Category));
    },

    async getById(id: string): Promise<Category | null> {
        const ref = doc(db, COLLECTION, id);
        const snapshot = await getDoc(ref);
        if (!snapshot.exists()) return null;
        return { id: snapshot.id, ...snapshot.data() } as Category;
    },

    // Kategori ID'si anlamlı ('wood', 'ethanol', 'electric') olduğu için setDoc kullanıyoruz
    async create(data: Category): Promise<Category> {
        const ref = doc(db, COLLECTION, data.id);
        await setDoc(ref, data);
        return data;
    },

    async update(id: string, data: Partial<Omit<Category, 'id'>>): Promise<void> {
        const ref = doc(db, COLLECTION, id);
        await updateDoc(ref, data as Record<string, unknown>);
    },

    async delete(id: string): Promise<void> {
        const ref = doc(db, COLLECTION, id);
        await deleteDoc(ref);
    },
};
