// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: import('$lib/server/auth/session').SessionData | null;
			user: import('$lib/server/auth/session').SessionUser | null;
			csrfToken?: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}


export {};
