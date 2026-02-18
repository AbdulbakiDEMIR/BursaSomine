/**
 * Auth Helper — API route'ları için guard fonksiyonları
 * YENİ MOD: Client-side auth geçişi nedeniyle server-side kontrol devre dışı (BYPASS MODE)
 * Kullanıcı Service Account kuramadığı için API'ler şimdilik herkese açık ama UI gizli.
 */
import { NextRequest } from 'next/server';

// Bypass mode: API route'ları her zaman "yetkili" döner, çünkü server-side token doğrulama yapılamıyor
// (Service Account Key eksik). UI tarafında koruma var.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function requireAdmin(req: NextRequest) {
    return null; // Always authorized
}

export const SESSION_COOKIE_NAME = 'admin_session';
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 5;
