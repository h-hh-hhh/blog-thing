import type { Handle } from '@sveltejs/kit';
import {
	CSRF_COOKIE_NAME,
	createCsrfToken,
	getCsrfCookieOptions,
	SESSION_COOKIE_NAME,
	getSessionClearOptions,
	readSessionValue
} from '$lib/server/auth/session';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionValue = event.cookies.get(SESSION_COOKIE_NAME);
	const session = readSessionValue(sessionValue);

	event.locals.session = session;
	event.locals.user = session?.user ?? null;

	const csrfCookie = event.cookies.get(CSRF_COOKIE_NAME);
	if (!csrfCookie) {
		try {
			const token = createCsrfToken();
			event.cookies.set(CSRF_COOKIE_NAME, token, getCsrfCookieOptions());
			event.locals.csrfToken = token;
		} catch {
			// ignore if secrets missing
		}
	} else {
		event.locals.csrfToken = csrfCookie;
	}

	const response = await resolve(event);

	if (sessionValue && !session) {
		event.cookies.delete(SESSION_COOKIE_NAME, getSessionClearOptions());
	}

	return response;
};
