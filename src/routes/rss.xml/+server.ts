import { siteTitle } from '$lib/config/site';
import { db } from '$lib/server/db';
import type { RequestHandler } from './$types';
import { desc } from 'drizzle-orm';
import { posts } from '$lib/server/db/schema';

const escapeXml = (value: string) =>
	value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');

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

	const items = allPosts
		.map((post) => {
			const link = `${origin}/posts/${post.slug}`;
			const title = escapeXml(post.title);
			const description = escapeXml(post.summary ?? '');
			const pubDate = toIso(post.publishedAt) ?? toIso(post.createdAt);
			return `  <item>
    <title>${title}</title>
    <link>${link}</link>
    <guid>${link}</guid>
    ${description ? `<description>${description}</description>` : ''}
    ${pubDate ? `<pubDate>${new Date(pubDate).toUTCString()}</pubDate>` : ''}
  </item>`;
		})
		.join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(siteTitle)}</title>
  <link>${origin}</link>
  <description>${escapeXml(siteTitle)}</description>
  ${items}
</channel>
</rss>
`;

	return new Response(body, {
		headers: {
			'content-type': 'application/xml; charset=utf-8'
		}
	});
};
