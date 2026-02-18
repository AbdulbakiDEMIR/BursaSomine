import { NextRequest } from 'next/server';
import { PageModel, PageId, PageData } from '@/models/pageModel';
import { successResponse, errorResponse } from '@/lib/apiResponse';

const VALID_PAGE_IDS: PageId[] = ['home', 'about', 'faq'];

export const PageController = {
    async getPage(pageId: string) {
        try {
            if (!VALID_PAGE_IDS.includes(pageId as PageId)) {
                return errorResponse(`Geçersiz sayfa ID'si. 'home', 'about' veya 'faq' olmalıdır.`, 400);
            }

            const data = await PageModel.getPage(pageId as PageId);
            if (!data) return errorResponse('Sayfa verisi bulunamadı.', 404);
            return successResponse(data);
        } catch (err) {
            console.error('[PageController.getPage]', err);
            return errorResponse('Sayfa verisi getirilirken bir hata oluştu.');
        }
    },

    async updatePage(req: NextRequest, pageId: string) {
        try {
            if (!VALID_PAGE_IDS.includes(pageId as PageId)) {
                return errorResponse(`Geçersiz sayfa ID'si. 'home', 'about' veya 'faq' olmalıdır.`, 400);
            }

            const body = await req.json() as Partial<PageData>;
            await PageModel.updatePage(pageId as PageId, body);
            return successResponse({ message: `'${pageId}' sayfası başarıyla güncellendi.` });
        } catch (err) {
            console.error('[PageController.updatePage]', err);
            return errorResponse('Sayfa güncellenirken bir hata oluştu.');
        }
    },
};
