import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-node';
import path from 'path';
import 'dotenv/config';
import {
  rehypeSvelteComponentTags,
  remarkSvelteComponentImports
} from './src/lib/markdown/mdsvex-components.ts';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: { 
		adapter: adapter(),
		alias: {
            '@posts': path.resolve(process.env.POSTS_DIR || '/posts'),
            '@uploads': path.resolve(process.env.UPLOADS_DIR || '/uploads'),
        }
	},
	preprocess: [
		mdsvex({
			extensions: ['.svx', '.md'],
			layout: path.resolve('src/lib/components/markdown/layout.svelte'),
			remarkPlugins: [remarkSvelteComponentImports],
			rehypePlugins: [rehypeSvelteComponentTags]
		})
	],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
