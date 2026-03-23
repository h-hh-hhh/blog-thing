import path from 'path';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { remarkCustomMathFootnotes } from './remark-custom-math-footnotes.ts';
import {
	rehypeSvelteComponentTags,
	remarkSvelteComponentImports,
	rehypeTaskListItems
} from './mdsvex-components.ts';

const remarkPlugins = [
	remarkSvelteComponentImports,
	[remarkMath, { singleDollarTextMath: true }],
	[remarkGfm, { footnotes: true }],
	remarkCustomMathFootnotes
];

export const mdsvexOptions = {
	extensions: ['.svx', '.md'],
	layout: path.resolve('src/lib/components/markdown/layout.svelte'),
	remarkPlugins,
	rehypePlugins: [rehypeTaskListItems, [rehypeKatex, { output: 'html' }], rehypeSvelteComponentTags]
};
