import { NextRequest } from 'next/server';
import { SiteSettingsModel } from '@/models/siteSettingsModel';
import { successResponse, errorResponse } from '@/lib/apiResponse';
import { SiteSettings } from '@/types';

export const SiteSettingsController = {
    async get() {
        try {
            const settings = await SiteSettingsModel.get();
            if (!settings) return errorResponse('Site ayarları bulunamadı.', 404);
            return successResponse(settings);
        } catch (err) {
            console.error('[SiteSettingsController.get]', err);
            return errorResponse('Site ayarları getirilirken bir hata oluştu.');
        }
    },

    async update(req: NextRequest) {
        try {
            const body = await req.json() as Partial<SiteSettings>;
            await SiteSettingsModel.update(body);
            return successResponse({ message: 'Site ayarları başarıyla güncellendi.' });
        } catch (err) {
            console.error('[SiteSettingsController.update]', err);
            return errorResponse('Site ayarları güncellenirken bir hata oluştu.');
        }
    },
};
