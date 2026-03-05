import { type RequestHandler } from '@sveltejs/kit';
import { zod4 } from 'sveltekit-superforms/adapters';
import { actionResult, setError, superValidate } from 'sveltekit-superforms/server';
import { loginSchema } from '$lib/db/schema';
import { db } from '$lib/server/db';
import { users } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import {
	SESSION_COOKIE_NAME,
	createSessionValue,
	getSessionCookieOptions
} from '$lib/server/auth/session';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const form = await superValidate(request, zod4(loginSchema), { id: 'login-layout' });

	if (!form.valid) {
		return actionResult('failure', { form }, { status: 400 });
	}

	const email = form.data.email;
	const password = form.data.password;

	const user = (await db.select().from(users).where(eq(users.email, email)))[0];

	if (!user) {
		setError(form, 'email', 'User does not exist', { status: 403, overwrite: true });
		return actionResult('failure', { form }, { status: 403 });
	}

	const isValid = await bcrypt.compare(password, user.passwordHash);

	if (!isValid) {
		setError(form, 'password', 'Invalid password', { status: 403, overwrite: true });
		return actionResult('failure', { form }, { status: 403 });
	}

	const sessionValue = createSessionValue({
		id: user.id,
		email: user.email,
		role: user.role
	});

	cookies.set(SESSION_COOKIE_NAME, sessionValue, getSessionCookieOptions());

	return actionResult('success', { form });
};
