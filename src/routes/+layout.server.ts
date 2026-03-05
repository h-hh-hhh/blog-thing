import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/db/schema';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const form = await superValidate(zod4(loginSchema), { id: 'login-layout' });
	const csrfToken = locals.csrfToken ?? cookies.get('csrf_token');
	if (csrfToken) {
		form.data.csrf = csrfToken;
	}

	return { layoutLoginForm: form, session: locals.session, user: locals.user, csrfToken };
};
