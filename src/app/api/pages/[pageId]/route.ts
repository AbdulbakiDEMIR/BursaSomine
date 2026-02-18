import { NextRequest } from 'next/server';
import { PageController } from '@/controllers/pageController';
import { requireAdmin } from '@/lib/auth';

type Params = { params: Promise<{ pageId: string }> };

// GET /api/pages/[pageId] — Sayfa verisini getir (public)
export async function GET(_req: NextRequest, { params }: Params) {
    const { pageId } = await params;
    return PageController.getPage(pageId);
}

// PUT /api/pages/[pageId] — Sayfa verisini güncelle (admin only)
export async function PUT(req: NextRequest, { params }: Params) {
    const authError = await requireAdmin(req);
    if (authError) return authError;
    const { pageId } = await params;
    return PageController.updatePage(req, pageId);
}
