import { NextRequest } from 'next/server';
import { ProductController } from '@/controllers/productController';
import { requireAdmin } from '@/lib/auth';

type Params = { params: Promise<{ id: string }> };

// GET /api/products/[id] — Tek ürün getir (public)
export async function GET(_req: NextRequest, { params }: Params) {
    const { id } = await params;
    return ProductController.getById(id);
}

// PUT /api/products/[id] — Ürün güncelle (admin only)
export async function PUT(req: NextRequest, { params }: Params) {
    const authError = await requireAdmin(req);
    if (authError) return authError;
    const { id } = await params;
    return ProductController.update(req, id);
}

// DELETE /api/products/[id] — Ürün sil (admin only)
export async function DELETE(req: NextRequest, { params }: Params) {
    const authError = await requireAdmin(req);
    if (authError) return authError;
    const { id } = await params;
    return ProductController.delete(id);
}
