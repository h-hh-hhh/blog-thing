import type { LayoutServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms/server';
import { zod4 } from 'sveltekit-superforms/adapters';
import { loginSchema } from '$lib/db/schema';

export const load: LayoutServerLoad = async ({ locals }) => {
	const form = await superValidate(zod4(loginSchema), { id: 'login-layout' });

	return { layoutLoginForm: form, session: locals.session, user: locals.user };
};
