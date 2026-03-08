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
		'text',
		'toml',
		'typescript',
		'yaml'
	]
});

const parseCodeMeta = (meta) => {
	if (!meta) return { showLineNumbers: false, startLine: 1, title: undefined, prefix: undefined };
	const showLineNumbers = meta.includes('showLineNumbers');
	const startLineMatch = meta.match(/startLine=([1-9]\d*)/);
	const titleMatch = meta.match(/title=(?:"([^"]+)"|'([^']+)')/);
	const prefixMatch = meta.match(/prefix=(?:"([^"]+)"|'([^']+)'|(\S+))/);
	return {
		showLineNumbers,
		startLine: parseInt(startLineMatch?.[1]) || 1,
		title: titleMatch?.[1] ?? titleMatch?.[2],
		prefix: prefixMatch?.[1] ?? prefixMatch?.[2] ?? prefixMatch?.[3]
	};
};

const normalizeLanguage = (lang) => {
	if (!lang) return 'text';
	const lowered = String(lang).toLowerCase();
	const map = {
		js: 'javascript',
		jsx: 'javascript',
		ts: 'typescript',
		tsx: 'typescript',
		sh: 'shellscript',
		zsh: 'shellscript',
		bash: 'bash',
		yml: 'yaml'
	};
	return map[lowered] ?? lowered;
};

const addLineNumbers = (html, startLine = 1) => {
	let line = startLine;
	return html.replace(/<span class="line([^"]*)">/g, (_match, rest) => {
		const current = line;
		line += 1;
		return `<span class="line${rest}" data-line="${current}">`;
	});
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
					const safeLang = normalizeLanguage(lang);
					const { showLineNumbers, startLine, title, prefix } = parseCodeMeta(meta);
					const html = highlighter.codeToHtml(code, {
						lang: safeLang,
						themes: {
							light: 'github-light',
							dark: 'github-dark'
						},
						defaultColor: false
					});
					const useLineNumbers = showLineNumbers && !prefix;
					const withLineMarkers = useLineNumbers ? addLineNumbers(html, startLine) : html;
					const inner = escapeSvelte(
						withLineMarkers
							.replace(/^<pre[^>]*><code>/, '')
							.replace(/<\/code><\/pre>\s*$/, '')
					);
					const dataTitle = title ? ` data-title="${escapeSvelte(title)}"` : '';
					const dataLineNumbers = useLineNumbers ? ' data-line-numbers="true"' : '';
					const dataPrefix = prefix ? ` data-prefix="${escapeSvelte(prefix)}"` : '';
					return `<Pre class="shiki"${dataTitle}${dataLineNumbers}${dataPrefix}><code class="language-${safeLang}">{@html \`${inner}\`}</code></Pre>`;
				}
			},
			rehypePlugins: [rehypeSvelteComponentTags]
		})
	],
	extensions: ['.svelte', '.svx', '.md']
};

export default config;
