import { NextRequest } from 'next/server';
import { CategoryModel } from '@/models/categoryModel';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { Category } from '@/types';

const VALID_IDS = ['wood', 'ethanol', 'electric'];

export const CategoryController = {
    async getAll() {
        try {
            const categories = await CategoryModel.getAll();
            return successResponse(categories);
        } catch (err) {
            console.error('[CategoryController.getAll]', err);
            return errorResponse('Kategoriler getirilirken bir hata oluştu.');
        }
    },

    async getById(id: string) {
        try {
            const category = await CategoryModel.getById(id);
            if (!category) return errorResponse('Kategori bulunamadı.', 404);
            return successResponse(category);
        } catch (err) {
            console.error('[CategoryController.getById]', err);
            return errorResponse('Kategori getirilirken bir hata oluştu.');
        }
    },

    async create(req: NextRequest) {
        try {
            const body = await req.json() as Category;

            if (!VALID_IDS.includes(body.id)) {
                return errorResponse(`Kategori ID'si 'wood', 'ethanol' veya 'electric' olmalıdır.`, 400);
            }
            if (!body.title?.tr || !body.title?.en) {
                return errorResponse('Kategori başlığı (tr ve en) zorunludur.', 400);
            }

            const existing = await CategoryModel.getById(body.id);
            if (existing) return errorResponse(`'${body.id}' ID'li kategori zaten mevcut.`, 409);

            const newCategory = await CategoryModel.create(body);
            return successResponse(newCategory, 201);
        } catch (err) {
            console.error('[CategoryController.create]', err);
            return errorResponse('Kategori oluşturulurken bir hata oluştu.');
        }
    },

    async update(req: NextRequest, id: string) {
        try {
            const body = await req.json() as Partial<Omit<Category, 'id'>>;
            const existing = await CategoryModel.getById(id);
            if (!existing) return errorResponse('Kategori bulunamadı.', 404);

            await CategoryModel.update(id, body);
            return successResponse({ id, ...body });
        } catch (err) {
            console.error('[CategoryController.update]', err);
            return errorResponse('Kategori güncellenirken bir hata oluştu.');
        }
    },

    async delete(id: string) {
        try {
            const existing = await CategoryModel.getById(id);
            if (!existing) return errorResponse('Kategori bulunamadı.', 404);

            await CategoryModel.delete(id);
            return successResponse({ message: 'Kategori başarıyla silindi.', id });
        } catch (err) {
            console.error('[CategoryController.delete]', err);
            return errorResponse('Kategori silinirken bir hata oluştu.');
        }
    },
};
