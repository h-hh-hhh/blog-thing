import { type RequestHandler } from '@sveltejs/kit';
import { zod4 } from 'sveltekit-superforms/adapters';
import { actionResult, setError, superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/db/schema';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import {
	CSRF_COOKIE_NAME,
	CSRF_HEADER_NAME,
	SESSION_COOKIE_NAME,
	createSessionValue,
	getSessionCookieOptions,
	verifyCsrfToken
} from '$lib/server/auth/session';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const csrfCookie = cookies.get(CSRF_COOKIE_NAME);
	const csrfHeader = request.headers.get(CSRF_HEADER_NAME);
	const form = await superValidate(request, zod4(loginSchema), { id: 'login-layout' });

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

	const name = form.data.name;
	const password = form.data.password;

	const user = (await db.select().from(users).where(eq(users.name, name)))[0];

	if (!user) {
		setError(form, 'name', 'User does not exist', { status: 403, overwrite: true });
		return actionResult('failure', { form }, { status: 403 });
	}

	const isValid = await bcrypt.compare(password, user.passwordHash);

	if (!isValid) {
		setError(form, 'password', 'Invalid password', { status: 403, overwrite: true });
		return actionResult('failure', { form }, { status: 403 });
	}

	const sessionValue = createSessionValue({
		id: user.id,
		name: user.name,
		role: user.role
	});

	cookies.set(SESSION_COOKIE_NAME, sessionValue, getSessionCookieOptions());

	return actionResult('success', { form });
};
