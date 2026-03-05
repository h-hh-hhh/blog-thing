import type { Handle } from '@sveltejs/kit';
import {
	SESSION_COOKIE_NAME,
	getSessionClearOptions,
	readSessionValue
} from '$lib/server/auth/session';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionValue = event.cookies.get(SESSION_COOKIE_NAME);
	const session = readSessionValue(sessionValue);

	event.locals.session = session;
	event.locals.user = session?.user ?? null;

	const response = await resolve(event);

	if (sessionValue && !session) {
		event.cookies.delete(SESSION_COOKIE_NAME, getSessionClearOptions());
	}

	return response;
};
