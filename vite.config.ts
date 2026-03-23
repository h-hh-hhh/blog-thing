import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { mdsvex } from 'mdsvex';
import { mdsvexOptions } from './src/lib/markdown/mdsvex-options.ts';

export default defineConfig({
	plugins: [tailwindcss(), mdsvex(mdsvexOptions as never), sveltekit()],
	server: {
		fs: {
			allow: ['posts', 'uploads']
		}
	}
});
