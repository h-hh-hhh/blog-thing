import { relations, sql } from 'drizzle-orm';
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const now = () => sql`(unixepoch())`;

export const users = sqliteTable('users', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull().unique(),
	passwordHash: text('password_hash').notNull(),
	role: text('role').notNull().default('user'),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(now()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(now())
});

export const posts = sqliteTable('posts', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	slug: text('slug').notNull().unique(),
	title: text('title').notNull(),
	summary: text('summary'),
	contentPath: text('content_path').notNull(),
	status: text('status').notNull().default('draft'),
	publishedAt: integer('published_at', { mode: 'timestamp' }),
	heroImagePath: text('hero_image_path'),
	authorId: text('author_id').references(() => users.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(now()),
	updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(now())
});

export const tags = sqliteTable('tags', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull().unique(),
	slug: text('slug').notNull().unique(),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(now())
});

export const postsToTags = sqliteTable(
	'posts_tags',
	{
		postId: text('post_id')
			.notNull()
			.references(() => posts.id, { onDelete: 'cascade' }),
		tagId: text('tag_id')
			.notNull()
			.references(() => tags.id, { onDelete: 'cascade' }),
		createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(now())
	},
	(table) => ({
		pk: primaryKey({ columns: [table.postId, table.tagId] })
	})
);

export const assets = sqliteTable('assets', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	filePath: text('file_path').notNull().unique(),
	mimeType: text('mime_type').notNull(),
	uploadedBy: text('uploaded_by').references(() => users.id),
	createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(now())
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	assets: many(assets)
}));

export const postsRelations = relations(posts, ({ many, one }) => ({
	tags: many(postsToTags),
	author: one(users, {
		fields: [posts.authorId],
		references: [users.id]
	})
}));

export const tagsRelations = relations(tags, ({ many }) => ({
	posts: many(postsToTags)
}));

export const postsToTagsRelations = relations(postsToTags, ({ one }) => ({
	post: one(posts, {
		fields: [postsToTags.postId],
		references: [posts.id]
	}),
	tag: one(tags, {
		fields: [postsToTags.tagId],
		references: [tags.id]
	})
}));

export const assetsRelations = relations(assets, ({ one }) => ({
	uploader: one(users, {
		fields: [assets.uploadedBy],
		references: [users.id]
	})
}));
