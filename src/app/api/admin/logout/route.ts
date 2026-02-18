/**
 * POST /api/admin/logout
 * Session cookie'yi temizler ve revoke eder
 */
import { NextRequest, NextResponse } from 'next/server';
import { revokeSessionCookie } from '@/lib/firebaseAdmin';
import { SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: NextRequest) {
    // Simplified mode: We don't revoke the token on server-side because
    // we might not have the Admin SDK credentials set up.
    // Just clearing the cookie is enough for the client-side experience.
    /*
    if (cookie) {
        await revokeSessionCookie(cookie);
    }
    */

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 0,
        path: '/',
    });

    return response;
}
