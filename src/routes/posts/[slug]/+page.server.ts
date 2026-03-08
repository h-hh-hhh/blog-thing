import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db'; // Your DB client

export const load: PageServerLoad = async ({ params }) => {
    // 1. Fetch metadata from DB
	const post = await db.query.posts.findFirst({
		where: (posts, { eq }) => eq(posts.slug, params.slug),
		with: {
			tags: {
				with: {
					tag: true
				}
			},
			author: true
		}
	});
	
    if (!post) {
        throw error(404, 'Post not found in database');
    }

    // 2. Return the DB data
    return {
        post
    };
};