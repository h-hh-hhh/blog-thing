import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';
import { desc } from 'drizzle-orm';
import { posts } from '$lib/server/db/schema';

const toIso = (value: Date | number | null) => {
	if (!value) return null;
	const date = value instanceof Date ? value : new Date(value);
	return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

export const GET: RequestHandler = async ({ url }) => {
	const origin = url.origin;
	const allPosts = await db.query.posts.findMany({
		orderBy: [desc(posts.publishedAt)]
	});

	const urls = [
		{
			loc: `${origin}/`,
			lastmod: null as string | null
		}
	];

	for (const post of allPosts) {
		const lastmod =
			toIso(post.updatedAt) ?? toIso(post.publishedAt) ?? toIso(post.createdAt);
		urls.push({
			loc: `${origin}/posts/${post.slug}`,
			lastmod
		});
	}

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
		.map(
			(entry) => `  <url>
    <loc>${entry.loc}</loc>
${entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>
` : ''}  </url>`
		)
		.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8'
		}
	});
};
