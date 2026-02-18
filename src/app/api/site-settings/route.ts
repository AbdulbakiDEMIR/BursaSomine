import { NextRequest } from 'next/server';
import { SiteSettingsController } from '@/controllers/siteSettingsController';
import { requireAdmin } from '@/lib/auth';

// GET /api/site-settings — Site ayarlarını getir (public)
export async function GET() {
    return SiteSettingsController.get();
}

// PUT /api/site-settings — Site ayarlarını güncelle (admin only)
export async function PUT(req: NextRequest) {
    const authError = await requireAdmin(req);
    if (authError) return authError;
    return SiteSettingsController.update(req);
}
