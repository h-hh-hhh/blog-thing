import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { loginSchema, logoutSchema } from '$lib/db/schema';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const loginForm = await superValidate(zod4(loginSchema), { id: 'login-layout' });
	const logoutForm = await superValidate(zod4(logoutSchema), { id: 'logout-layout' });
	const csrfToken = locals.csrfToken ?? cookies.get('csrf_token');
	if (csrfToken) {
		loginForm.data.csrf = csrfToken;
		logoutForm.data.csrf = csrfToken;
	}

	return { layoutLoginForm: loginForm, layoutLogoutForm: logoutForm, session: locals.session, user: locals.user, csrfToken };
};
