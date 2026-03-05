import { z } from 'zod';

export const loginSchema = z.object({
	email: z.email(),
	password: z.string().min(1),
	csrf: z.string().min(1)
});

export const logoutSchema = z.object({
	csrf: z.string().min(1)
});
