type Parent = { children?: Node[] };
type ElementNode = { type: 'element'; tagName: string; children?: Node[] };
type HtmlNode = { type: 'html'; value: string };
type Node = ElementNode | HtmlNode | Parent | { [key: string]: unknown };

const componentImports = {
  a: { name: 'A', path: '$lib/components/markdown/a.svelte' },
  blockquote: { name: 'Blockquote', path: '$lib/components/markdown/blockquote.svelte' },
  caption: { name: 'Caption', path: '$lib/components/markdown/caption.svelte' },
  code: { name: 'Code', path: '$lib/components/markdown/code.svelte' },
  em: { name: 'Em', path: '$lib/components/markdown/em.svelte' },
  h1: { name: 'H1', path: '$lib/components/markdown/h1.svelte' },
  h2: { name: 'H2', path: '$lib/components/markdown/h2.svelte' },
  h3: { name: 'H3', path: '$lib/components/markdown/h3.svelte' },
  h4: { name: 'H4', path: '$lib/components/markdown/h4.svelte' },
  h5: { name: 'H5', path: '$lib/components/markdown/h5.svelte' },
  h6: { name: 'H6', path: '$lib/components/markdown/h6.svelte' },
  hr: { name: 'Hr', path: '$lib/components/markdown/hr.svelte' },
  img: { name: 'Img', path: '$lib/components/markdown/img.svelte' },
  li: { name: 'Li', path: '$lib/components/markdown/li.svelte' },
  ol: { name: 'Ol', path: '$lib/components/markdown/ol.svelte' },
  p: { name: 'P', path: '$lib/components/markdown/p.svelte' },
  pre: { name: 'Pre', path: '$lib/components/markdown/pre.svelte' },
  strong: { name: 'Strong', path: '$lib/components/markdown/strong.svelte' },
  table: { name: 'Table', path: '$lib/components/markdown/table.svelte' },
  tbody: { name: 'Tbody', path: '$lib/components/markdown/tbody.svelte' },
  td: { name: 'Td', path: '$lib/components/markdown/td.svelte' },
  th: { name: 'Th', path: '$lib/components/markdown/th.svelte' },
  thead: { name: 'Thead', path: '$lib/components/markdown/thead.svelte' },
  tr: { name: 'Tr', path: '$lib/components/markdown/tr.svelte' },
  ul: { name: 'Ul', path: '$lib/components/markdown/ul.svelte' }
} as const;

const componentTagMap = Object.fromEntries(
  Object.entries(componentImports).map(([tag, meta]) => [tag, meta.name])
);

const importLines = Object.values(componentImports)
  .map((meta) => `import ${meta.name} from '${meta.path}';`)
  .join('\n');

const hasComponentImport = (value: string) =>
  Object.values(componentImports).some((meta) => value.includes(meta.path));

const visit = (node: Node, fn: (node: Node) => void) => {
  if (!node) return;
  fn(node);
  const parent = node as Parent;
  if (Array.isArray(parent.children)) {
    parent.children.forEach((child) => visit(child, fn));
  }
};

export const remarkSvelteComponentImports = () => {
  return (tree: Node) => {
    const parent = tree as Parent;
    if (!parent.children) parent.children = [];

    for (const node of parent.children) {
      const htmlNode = node as HtmlNode;
      if (htmlNode.type !== 'html' || typeof htmlNode.value !== 'string') continue;
      const trimmed = htmlNode.value.trim();
      if (!trimmed.startsWith('<script')) continue;
      if (hasComponentImport(htmlNode.value)) return;

      const scriptStartMatch = htmlNode.value.match(/<script[^>]*>/);
      const scriptEndIndex = htmlNode.value.lastIndexOf('</script>');
      if (!scriptStartMatch || scriptEndIndex === -1) return;

      const scriptStart = scriptStartMatch[0];
      const scriptBody = htmlNode.value.slice(scriptStart.length, scriptEndIndex).trim();
      const combinedBody = scriptBody
        ? `${importLines}\n${scriptBody}`
        : importLines;

      htmlNode.value = `${scriptStart}\n${combinedBody}\n</script>`;
      return;
    }

    parent.children.unshift({
      type: 'html',
      value: `<script>\n${importLines}\n</script>`
    } as HtmlNode);
  };
};

export const rehypeSvelteComponentTags = () => {
  return (tree: Node) => {
    visit(tree, (node) => {
      const element = node as ElementNode;
      if (element.type !== 'element') return;
      const nextTag = componentTagMap[element.tagName];
      if (nextTag) element.tagName = nextTag;
    });
  };
};
