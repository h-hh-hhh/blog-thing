import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE_NAME = 'session';
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export type SessionUser = {
	id: string;
	email: string;
	role: string;
};

export type SessionData = {
	user: SessionUser;
	issuedAt: number;
	expiresAt: number;
	nonce: string;
};

const getSessionSecret = () => process.env.SESSION_SECRET;

const base64UrlEncode = (input: Buffer | string) => {
	const buffer = typeof input === 'string' ? Buffer.from(input) : input;
	return buffer
		.toString('base64')
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/g, '');
};

const base64UrlDecode = (input: string) => {
	const normalized = input.replace(/-/g, '+').replace(/_/g, '/');
	const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
	return Buffer.from(padded, 'base64');
};

const signPayload = (payload: string) => {
	const secret = getSessionSecret();
	if (!secret) {
		throw new Error('SESSION_SECRET is not set');
	}
	return base64UrlEncode(createHmac('sha256', secret).update(payload).digest());
};

const verifySignature = (payload: string, signature: string) => {
	const secret = getSessionSecret();
	if (!secret) return false;
	const expected = base64UrlEncode(createHmac('sha256', secret).update(payload).digest());
	const expectedBuffer = Buffer.from(expected);
	const signatureBuffer = Buffer.from(signature);
	if (expectedBuffer.length !== signatureBuffer.length) return false;
	return timingSafeEqual(expectedBuffer, signatureBuffer);
};

export const createSessionValue = (user: SessionUser) => {
	const issuedAt = Math.floor(Date.now() / 1000);
	const expiresAt = issuedAt + SESSION_TTL_SECONDS;
	const session: SessionData = {
		user,
		issuedAt,
		expiresAt,
		nonce: base64UrlEncode(randomBytes(16))
	};
	const payload = base64UrlEncode(JSON.stringify(session));
	const signature = signPayload(payload);
	return `${payload}.${signature}`;
};

export const readSessionValue = (value: string | undefined | null) => {
	if (!value) return null;
	const [payload, signature] = value.split('.');
	if (!payload || !signature) return null;
	if (!verifySignature(payload, signature)) return null;

	try {
		const decoded = base64UrlDecode(payload).toString('utf-8');
		const session = JSON.parse(decoded) as SessionData;
		const now = Math.floor(Date.now() / 1000);
		if (!session.expiresAt || session.expiresAt < now) return null;
		return session;
	} catch {
		return null;
	}
};

export const getSessionCookieOptions = () => ({
	path: '/',
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: process.env.NODE_ENV === 'production',
	maxAge: SESSION_TTL_SECONDS
});

export const getSessionClearOptions = () => ({
	path: '/',
	httpOnly: true,
	sameSite: 'lax' as const,
	secure: process.env.NODE_ENV === 'production',
	maxAge: 0
});
