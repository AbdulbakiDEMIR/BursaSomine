/**
 * Firebase Admin SDK — Server-side only
 * Session cookie oluşturma ve doğrulama için kullanılır.
 */
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let adminApp: App;

function getAdminApp(): App {
    if (getApps().length > 0) {
        return getApps()[0];
    }

    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
        throw new Error(
            'Firebase Admin ortam değişkenleri eksik. ' +
            'FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY gerekli.'
        );
    }

    adminApp = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
    });

    return adminApp;
}

/**
 * Firebase idToken'ı doğrulayıp session cookie oluşturur.
 * Süresi: 5 gün
 */
export async function createSessionCookie(idToken: string): Promise<string> {
    const auth = getAuth(getAdminApp());
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 gün (ms)
    return auth.createSessionCookie(idToken, { expiresIn });
}

/**
 * Session cookie'yi doğrular ve decoded token döner.
 * Geçersizse null döner.
 */
export async function verifySessionCookie(sessionCookie: string) {
    try {
        const auth = getAuth(getAdminApp());
        return await auth.verifySessionCookie(sessionCookie, true);
    } catch {
        return null;
    }
}

/**
 * Session cookie'yi iptal eder (logout için).
 */
export async function revokeSessionCookie(sessionCookie: string): Promise<void> {
    try {
        const auth = getAuth(getAdminApp());
        const decoded = await auth.verifySessionCookie(sessionCookie);
        await auth.revokeRefreshTokens(decoded.uid);
    } catch {
        // Zaten geçersizse sessizce geç
    }
}
