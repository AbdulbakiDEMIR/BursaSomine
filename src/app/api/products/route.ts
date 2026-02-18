import { NextRequest } from 'next/server';
import { ProductController } from '@/controllers/productController';
import { requireAdmin } from '@/lib/auth';

// GET /api/products — Tüm ürünleri listele (public)
export async function GET() {
    return ProductController.getAll();
}

// POST /api/products — Yeni ürün ekle (admin only)
export async function POST(req: NextRequest) {
    const authError = await requireAdmin(req);
    if (authError) return authError;
    return ProductController.create(req);
}
