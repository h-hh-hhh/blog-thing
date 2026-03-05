import { type RequestHandler } from '@sveltejs/kit';
import { zod4 } from 'sveltekit-superforms/adapters';
import { actionResult, setError, superValidate } from 'sveltekit-superforms/server';
import { logoutSchema } from '$lib/db/schema';
import {
	CSRF_COOKIE_NAME,
	CSRF_HEADER_NAME,
	SESSION_COOKIE_NAME,
	getSessionClearOptions,
	verifyCsrfToken
} from '$lib/server/auth/session';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const csrfCookie = cookies.get(CSRF_COOKIE_NAME);
	const csrfHeader = request.headers.get(CSRF_HEADER_NAME);
	const form = await superValidate(request, zod4(logoutSchema), { id: 'logout-layout' });

	const submittedToken = csrfHeader ?? form.data.csrf;
	if (!submittedToken || !csrfCookie || submittedToken !== csrfCookie) {
		setError(form, 'csrf', 'Invalid CSRF token', { status: 403, overwrite: true });
		return actionResult('failure', { form }, { status: 403 });
	}

	if (!verifyCsrfToken(submittedToken)) {
		setError(form, 'csrf', 'Invalid CSRF token', { status: 403, overwrite: true });
		return actionResult('failure', { form }, { status: 403 });
	}

	if (!form.valid) {
		return actionResult('failure', { form }, { status: 400 });
	}
	
	cookies.delete(SESSION_COOKIE_NAME, getSessionClearOptions());

	return actionResult('success', { form });
};
