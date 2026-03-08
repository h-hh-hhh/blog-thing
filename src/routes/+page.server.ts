import { db } from '$lib/server/db';
import { posts } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
    // 1. Fetch metadata from DB
    const post = await db.query.posts.findMany({
        limit: 4,
        orderBy: [desc(posts.createdAt)],
        with: {
            tags: {
                with: {
                    tag: true
                }
            },
            author: true
        }
    });

    // 2. Return the DB data
    return {
        post
    };
};