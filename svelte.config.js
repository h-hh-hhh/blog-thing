import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-node';
import path from 'path';
import 'dotenv/config';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: { 
		adapter: adapter(),
		alias: {
            '@posts': path.resolve(process.env.POSTS_DIR || '/posts'),
            '@uploads': path.resolve(process.env.UPLOADS_DIR || '/uploads'),
        }
	},
	preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
