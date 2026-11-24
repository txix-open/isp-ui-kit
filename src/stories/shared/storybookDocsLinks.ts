// Repository Markdown stays portable; only its Storybook view uses docs routes.
const routes: Record<string, string> = {
  'react-json-view-rewrite.md': 'components-reactjsonview-переход--docs',
  'layout-navigation.md': 'layout-layoutmenu--docs',
  'layout-pages.md': 'layout-pages-обзор--docs',
  'auth-hook.md': 'hooks-useauth--docs',
};

export const storybookDocsLinks = (markdown: string) =>
  markdown.replace(/\]\(([^)]+\.md)\)/g, (link, path: string) =>
    routes[path] ? `](?path=/docs/${routes[path]})` : link,
  );

export const docsMarkdownOptions = {
  slugify: (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '')
      .trim()
      .replace(/\s+/g, '-'),
};
