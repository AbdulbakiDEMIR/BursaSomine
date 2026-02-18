import { NextRequest } from 'next/server';
import { CategoryController } from '@/controllers/categoryController';
import { requireAdmin } from '@/lib/auth';

// GET /api/categories — Tüm kategorileri listele (public)
export async function GET() {
    return CategoryController.getAll();
}

// POST /api/categories — Yeni kategori ekle (admin only)
export async function POST(req: NextRequest) {
    const authError = await requireAdmin(req);
    if (authError) return authError;
    return CategoryController.create(req);
}
