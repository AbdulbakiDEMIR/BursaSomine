/**
 * GET /api/admin/me
 * Mevcut session'ı doğrular, kullanıcı bilgisi döner
 */
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: NextRequest) {
    const session = await getAdminSession(req);

    if (!session) {
        return NextResponse.json(
            { success: false, error: 'Oturum bulunamadı.' },
            { status: 401 }
        );
    }

    return NextResponse.json({
        success: true,
        data: {
            uid: session.uid,
            email: session.email,
        },
    });
}
