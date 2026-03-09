type Parent = { children?: Node[] };
type HtmlNode = { type: 'html'; value: string };
type MathNode = { type: 'math' | 'inlineMath'; value: string };
type Node = Parent | HtmlNode | MathNode | { [key: string]: unknown };

const displayMathPattern = /^\s*<p>\s*\$\$([\s\S]+?)\$\$\s*<\/p>\s*$/i;
const inlineMathPattern = /^\s*<p>\s*\$([^$\n]+?)\$\s*<\/p>\s*$/i;

const visit = (node: Node, fn: (node: Node, parent?: Parent, index?: number) => void, parent?: Parent) => {
  if (!node) return;
  fn(node, parent);
  const container = node as Parent;
  if (!Array.isArray(container.children)) return;
  container.children.forEach((child, index) => {
    fn(child, container, index);
    visit(child, fn, container);
  });
};

export const remarkHtmlMath = () => {
  return (tree: Node) => {
    visit(tree, (node, parent, index) => {
      const htmlNode = node as HtmlNode;
      if (htmlNode.type !== 'html' || typeof htmlNode.value !== 'string') return;
      if (!parent || typeof index !== 'number') return;

      const displayMatch = htmlNode.value.match(displayMathPattern);
      if (displayMatch) {
        parent.children?.splice(index, 1, {
          type: 'math',
          value: displayMatch[1].trim()
        } as MathNode);
        return;
      }

      const inlineMatch = htmlNode.value.match(inlineMathPattern);
      if (inlineMatch) {
        parent.children?.splice(index, 1, {
          type: 'inlineMath',
          value: inlineMatch[1].trim()
        } as MathNode);
      }
    });
  };
};
