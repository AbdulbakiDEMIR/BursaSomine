/**
 * POST /api/admin/login
 * Firebase idToken alır → session cookie oluşturur → HttpOnly cookie set eder
 */
import { NextRequest, NextResponse } from 'next/server';
import { createSessionCookie } from '@/lib/firebaseAdmin';
import { SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE } from '@/lib/auth';

// Basit rate limiting: IP başına max 10 istek / dakika
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const entry = rateLimitMap.get(ip);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
        return true;
    }

    if (entry.count >= 10) return false;

    entry.count++;
    return true;
}

export async function POST(req: NextRequest) {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';
    if (!checkRateLimit(ip)) {
        return NextResponse.json(
            { success: false, error: 'Çok fazla giriş denemesi. Lütfen 1 dakika bekleyin.' },
            { status: 429 }
        );
    }

    try {
        const body = await req.json() as { idToken?: string };

        if (!body.idToken) {
            return NextResponse.json(
                { success: false, error: 'idToken gerekli.' },
                { status: 400 }
            );
        }

        const sessionCookie = await createSessionCookie(body.idToken);

        const response = NextResponse.json({ success: true });
        response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: SESSION_COOKIE_MAX_AGE,
            path: '/',
        });

        return response;
    } catch (err) {
        console.error('[admin/login]', err);
        return NextResponse.json(
            { success: false, error: 'Giriş başarısız. Kimlik bilgilerinizi kontrol edin.' },
            { status: 401 }
        );
    }
}
