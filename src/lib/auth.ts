import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'default-secret-change-in-production'
);

const COOKIE_NAME = 'admin_token';

export interface AdminPayload extends JWTPayload {
    username: string;
    iat: number;
    exp: number;
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

/**
 * Create a JWT token for admin authentication
 */
export async function createToken(username: string): Promise<string> {
    const token = await new SignJWT({ username })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET);

    return token;
}

/**
 * Verify and decode a JWT token
 */
export async function verifyToken(token: string): Promise<AdminPayload | null> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload as AdminPayload;
    } catch {
        return null;
    }
}

/**
 * Set the auth cookie
 */
export async function setAuthCookie(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });
}

/**
 * Get the auth token from cookies
 */
export async function getAuthToken(): Promise<string | null> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    return cookie?.value || null;
}

/**
 * Clear the auth cookie (logout)
 */
export async function clearAuthCookie(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

/**
 * Check if current user is authenticated as admin
 */
export async function isAuthenticated(): Promise<boolean> {
    const token = await getAuthToken();
    if (!token) return false;

    const payload = await verifyToken(token);
    return payload !== null;
}

/**
 * Get current admin user info
 */
export async function getCurrentAdmin(): Promise<AdminPayload | null> {
    const token = await getAuthToken();
    if (!token) return null;

    return verifyToken(token);
}
