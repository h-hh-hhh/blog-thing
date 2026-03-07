import { mdsvex, escapeSvelte } from 'mdsvex';
import adapter from '@sveltejs/adapter-node';
import path from 'path';
import 'dotenv/config';
import { createHighlighter } from 'shiki';
import {
  rehypeSvelteComponentTags,
  remarkSvelteComponentImports
} from './src/lib/markdown/mdsvex-components.ts';

const highlighter = await createHighlighter({
	themes: ['github-light', 'github-dark'],
	langs: [
		'bash',
		'css',
		'diff',
		'html',
		'javascript',
		'json',
		'markdown',
		'python',
		'shellscript',
		'sql',
		'svelte',
		'toml',
		'typescript',
		'yaml'
	]
});

const parseCodeMeta = (meta) => {
	if (!meta) return { showLineNumbers: false, title: undefined };
	const showLineNumbers = meta.includes('showLineNumbers');
	const titleMatch = meta.match(/title="([^"]+)"/);
	return {
		showLineNumbers,
		title: titleMatch?.[1]
	};
};

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
			highlight: {
				highlighter: async (code, lang, meta) => {
					const safeLang = lang ?? 'text';
					const { showLineNumbers, title } = parseCodeMeta(meta);
					const html = highlighter.codeToHtml(code, {
						lang: safeLang,
						themes: {
							light: 'github-light',
							dark: 'github-dark'
						},
						defaultColor: false
					});
					const inner = escapeSvelte(
						html
							.replace(/^<pre[^>]*><code>/, '')
							.replace(/<\/code><\/pre>\s*$/, '')
					);
					const dataTitle = title ? ` data-title="${escapeSvelte(title)}"` : '';
					const dataLineNumbers = showLineNumbers ? ' data-line-numbers="true"' : '';
					return `<Pre class="shiki"${dataTitle}${dataLineNumbers}><code class="language-${safeLang}">{@html \`${inner}\`}</code></Pre>`;
				}
			},
			rehypePlugins: [rehypeSvelteComponentTags]
		})
	],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
