import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const posts = import.meta.glob('@posts/*', { eager: true });
	const contentPath = data.post.contentPath;
	const entry = Object.entries(posts).find(
		([key]) => key.endsWith(`/${contentPath}`) || key.endsWith(`/posts/${contentPath}`)
	);
	if (!entry) {
		throw error(404, `Markdown file for "${data.post.slug}" (${contentPath}) is missing`);
	}
		const [, module] = entry;
		const post = (module as { default?: unknown })?.default ?? module;
try {
		return {
			...data,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			content: post as any
		};
	} catch (e) {
		throw error(500, `Error while rendering mdsvex: ${e}`);
	}
};
