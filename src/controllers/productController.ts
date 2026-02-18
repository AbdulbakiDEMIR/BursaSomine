import { NextRequest } from 'next/server';
import { ProductModel } from '@/models/productModel';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { Product } from '@/types';

export const ProductController = {
    async getAll() {
        try {
            const products = await ProductModel.getAll();
            return successResponse(products);
        } catch (err) {
            console.error('[ProductController.getAll]', err);
            return errorResponse('Ürünler getirilirken bir hata oluştu.');
        }
    },

    async getById(id: string) {
        try {
            const product = await ProductModel.getById(id);
            if (!product) return errorResponse('Ürün bulunamadı.', 404);
            return successResponse(product);
        } catch (err) {
            console.error('[ProductController.getById]', err);
            return errorResponse('Ürün getirilirken bir hata oluştu.');
        }
    },

    async create(req: NextRequest) {
        try {
            const body = await req.json() as Omit<Product, 'id'>;

            if (!body.name?.tr || !body.name?.en) {
                return errorResponse('Ürün adı (tr ve en) zorunludur.', 400);
            }
            if (!body.price) {
                return errorResponse('Fiyat zorunludur.', 400);
            }
            if (!['wood', 'ethanol', 'electric'].includes(body.category)) {
                return errorResponse("Kategori 'wood', 'ethanol' veya 'electric' olmalıdır.", 400);
            }

            const newProduct = await ProductModel.create({
                ...body,
                createdAt: new Date().toISOString(),
                isFeatured: body.isFeatured ?? false,
            });
            return successResponse(newProduct, 201);
        } catch (err) {
            console.error('[ProductController.create]', err);
            return errorResponse('Ürün oluşturulurken bir hata oluştu.');
        }
    },

    async update(req: NextRequest, id: string) {
        try {
            const body = await req.json() as Partial<Omit<Product, 'id'>>;
            const existing = await ProductModel.getById(id);
            if (!existing) return errorResponse('Ürün bulunamadı.', 404);

            await ProductModel.update(id, body);
            return successResponse({ id, ...body });
        } catch (err) {
            console.error('[ProductController.update]', err);
            return errorResponse('Ürün güncellenirken bir hata oluştu.');
        }
    },

    async delete(id: string) {
        try {
            const existing = await ProductModel.getById(id);
            if (!existing) return errorResponse('Ürün bulunamadı.', 404);

            await ProductModel.delete(id);
            return successResponse({ message: 'Ürün başarıyla silindi.', id });
        } catch (err) {
            console.error('[ProductController.delete]', err);
            return errorResponse('Ürün silinirken bir hata oluştu.');
        }
    },
};
