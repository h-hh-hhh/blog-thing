import katex from 'katex';

type Parent = { children?: Node[] };
type TextNode = { type: 'text'; value?: string };
type ParagraphNode = { type: 'paragraph'; children?: Node[] };
type HtmlNode = { type: 'html'; value: string };
type LinkReferenceNode = { type: 'linkReference'; identifier?: string; label?: string };
type InlineCodeNode = { type: 'inlineCode'; value?: string };
type DefinitionNode = { type: 'definition'; identifier?: string; url?: string; title?: string };
type Node =
	| Parent
	| TextNode
	| ParagraphNode
	| HtmlNode
	| LinkReferenceNode
	| InlineCodeNode
	| DefinitionNode
	| { [key: string]: unknown };

const visit = (
	node: Node,
	fn: (node: Node, parent?: Parent, index?: number) => void,
	parent?: Parent
) => {
	if (!node) return;
	fn(node, parent);
	const container = node as Parent;
	if (!Array.isArray(container.children)) return;
	container.children.forEach((child, index) => {
		fn(child, container, index);
		visit(child, fn, container);
	});
};

const renderMath = (value: string, displayMode: boolean) => {
	return katex.renderToString(value, { throwOnError: false, displayMode, output: 'html' });
};

const splitInlineMath = (value: string) => {
	const parts: Node[] = [];
	let rest = value;
	const pattern = /\$([^$\n]+?)\$/;
	while (true) {
		const match = rest.match(pattern);
		if (!match || match.index === undefined) break;
		const before = rest.slice(0, match.index);
		if (before) parts.push({ type: 'text', value: before } as TextNode);
		const html = renderMath(match[1].trim(), false);
		parts.push({ type: 'html', value: html } as HtmlNode);
		rest = rest.slice(match.index + match[0].length);
	}
	if (rest) parts.push({ type: 'text', value: rest } as TextNode);
	return parts.length > 0 ? parts : [{ type: 'text', value } as TextNode];
};

const splitFootnoteRefs = (value: string) => {
	const parts: Node[] = [];
	let rest = value;
	const pattern = /\[\^([^\]]+?)\]/;
	while (true) {
		const match = rest.match(pattern);
		if (!match || match.index === undefined) break;
		const before = rest.slice(0, match.index);
		if (before) parts.push({ type: 'text', value: before } as TextNode);
		const id = match[1];
		parts.push({
			type: 'html',
			value: `<sup id="fnref-${id}"><a href="#fn-${id}" data-footnote-ref>${id}</a></sup>`
		} as HtmlNode);
		rest = rest.slice(match.index + match[0].length);
	}
	if (rest) parts.push({ type: 'text', value: rest } as TextNode);
	return parts.length > 0 ? parts : [{ type: 'text', value } as TextNode];
};

const normalizeFootnoteId = (id: string) => id.replace(/^\^/, '');

export const remarkCustomMathFootnotes = () => {
	return (tree: Node) => {
		const definitions = new Map<string, string>();

		visit(tree, (node, parent, index) => {
			const defNode = node as DefinitionNode;
			if (defNode.type === 'definition' && typeof defNode.identifier === 'string') {
				const identifier = normalizeFootnoteId(defNode.identifier);
				if (identifier) {
					definitions.set(identifier, defNode.url ?? defNode.title ?? '');
					parent?.children?.splice(index ?? 0, 1);
					return;
				}
			}

			const paragraph = node as ParagraphNode;
			if (paragraph.type !== 'paragraph' || !Array.isArray(paragraph.children)) return;
			if (!parent || typeof index !== 'number') return;

			const combined = paragraph.children
				.map((child) => {
					const textNode = child as TextNode;
					return textNode.type === 'text' ? (textNode.value ?? '') : '';
				})
				.join('');
			const defMatch = combined.match(/^\s*\[\^([^\]]+?)\]:\s*([\s\S]+)$/);
			if (defMatch) {
				const identifier = normalizeFootnoteId(defMatch[1]);
				const value = defMatch[2];
				definitions.set(identifier, value.trim());
				parent.children?.splice(index, 1);
				return;
			}

			if (paragraph.children.length >= 2) {
				const first = paragraph.children[0] as LinkReferenceNode;
				const second = paragraph.children[1] as TextNode;
				if (
					first.type === 'linkReference' &&
					second.type === 'text' &&
					typeof second.value === 'string'
				) {
					const identifier = normalizeFootnoteId(first.identifier ?? first.label ?? '');
					const defText = second.value.trim().replace(/^:/, '').trim();
					if (identifier && second.value.trim().startsWith(':')) {
						const restText = paragraph.children
							.slice(2)
							.map((child) =>
								(child as TextNode).type === 'text' ? ((child as TextNode).value ?? '') : ''
							)
							.join('');
						definitions.set(identifier, `${defText}${restText}`.trim());
						parent.children?.splice(index, 1);
						return;
					}
				}
			}

			const nextChildren: Node[] = [];
			paragraph.children.forEach((child) => {
				const inlineCode = child as InlineCodeNode;
				if (inlineCode.type === 'inlineCode' && typeof inlineCode.value === 'string') {
					const value = inlineCode.value.trim();
					if (value.startsWith('$$') && value.endsWith('$$')) {
						const inner = value.slice(2, -2).trim();
						const html = renderMath(inner, true);
						nextChildren.push({ type: 'html', value: html } as HtmlNode);
						return;
					}
				}

				const linkRef = child as LinkReferenceNode;
				if (linkRef.type === 'linkReference') {
					const id = normalizeFootnoteId(linkRef.identifier ?? linkRef.label ?? '');
					if (id) {
						nextChildren.push({
							type: 'html',
							value: `<sup id="fnref-${id}"><a href="#fn-${id}" data-footnote-ref>${id}</a></sup>`
						} as HtmlNode);
						return;
					}
				}

				const textNode = child as TextNode;
				if (textNode.type !== 'text' || typeof textNode.value !== 'string') {
					nextChildren.push(child);
					return;
				}
				const withMath = splitInlineMath(textNode.value);
				withMath.forEach((mathPart) => {
					const mathText = mathPart as TextNode;
					if (mathText.type === 'text' && typeof mathText.value === 'string') {
						const withFootnotes = splitFootnoteRefs(mathText.value);
						nextChildren.push(...withFootnotes);
					} else {
						nextChildren.push(mathPart);
					}
				});
			});

			paragraph.children = nextChildren;
		});

		if (definitions.size > 0) {
			const parent = tree as Parent;
			if (!Array.isArray(parent.children)) return;
			const items = Array.from(definitions.entries())
				.map(
					([id, text]) =>
						`<li id="fn-${id}">${text} <a href="#fnref-${id}" data-footnote-backref>↩</a></li>`
				)
				.join('');
			parent.children?.push({
				type: 'html',
				value: `<section class="footnotes"><ol>${items}</ol></section>`
			} as HtmlNode);
		}
	};
};
