import { NextRequest } from 'next/server';
import { CategoryController } from '@/controllers/categoryController';
import { requireAdmin } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

// GET /api/categories/[id] — Tek kategori getir (public)
export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    return CategoryController.getById(id);
}

// PUT /api/categories/[id] — Kategori güncelle (admin only)
export async function PUT(req: NextRequest, { params }: Params) {
    const authError = await requireAdmin(req);
    if (authError) return authError;
    const { id } = await params;
    return CategoryController.update(req, id);
}

// DELETE /api/categories/[id] — Kategori sil (admin only)
export async function DELETE(req: NextRequest, { params }: Params) {
    const authError = await requireAdmin(req);
    if (authError) return authError;
    const { id } = await params;
    return CategoryController.delete(id);
}
