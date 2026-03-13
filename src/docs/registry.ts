import { componentDocs } from '../pages/docs/components/componentData.ts';

export const COLLET_VERSION = '0.2.2';
export const COLLET_REPO_URL = 'https://github.com/Danrozen87/collet';
export const COLLET_RELEASES_URL = `${COLLET_REPO_URL}/releases`;
export const COLLET_LICENSE_URL = `${COLLET_REPO_URL}/blob/main/LICENSE`;
export const DOCS_JSON_INDEX_URL = '/ai/collet-docs.json';
export const DOCS_LLM_INDEX_URL = '/llms.txt';

export type ComponentId = keyof typeof componentDocs;

export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface GuidePageMeta {
  id: string;
  title: string;
  href: string;
  description: string;
  group?: string;
  searchTerms?: string[];
}

export interface SearchEntry {
  label: string;
  href: string;
  group: string;
  description: string;
  keywords: string[];
}

export const guidePages: GuidePageMeta[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    href: '/docs/introduction',
    description:
      `Collet is a zero-hydration web UI component library with ${Object.keys(componentDocs).length} accessible components compiled to WebAssembly and delivered as Custom Elements.`,
    searchTerms: ['zero hydration', 'custom elements', 'wasm', 'ai development'],
  },
  {
    id: 'installation',
    title: 'Installation',
    href: '/docs/installation',
    description: 'Install @colletdev/core and the wrapper package for your framework.',
    searchTerms: ['npm install', 'tarballs', 'framework wrappers', '@colletdev/docs'],
  },
  {
    id: 'usage',
    title: 'Usage',
    href: '/docs/usage',
    description: 'Render first, initialize Collet lazily, and understand startup, selective registration, and runtime loading behavior.',
    searchTerms: ['init', 'lazy loading', 'selective registration', 'bundle size', 'preload false', 'render first'],
  },
  {
    id: 'seam',
    title: 'SEAM Demo',
    href: '/docs/seam',
    description: 'Repo-local proof of concept for ambient session, file, and task-triggered context pings tied to real Collet docs invariants.',
    searchTerms: ['seam', 'ambient context', 'ai triggers', 'file context', 'task context', 'writer', 'reader'],
  },
  {
    id: 'messages',
    title: 'Messages',
    href: '/docs/messages',
    description: 'Understand timeline-oriented message composition with Message Bubble, Message Group, Message Part, Activity Group, and Code Block.',
    group: 'Data Display',
    searchTerms: ['chat ui', 'message bubble', 'message group', 'message part', 'activity group', 'agent ui', 'timeline', 'tool calls', 'streaming'],
  },
  {
    id: 'conventions',
    title: 'Conventions',
    href: '/docs/conventions',
    description: 'Shared vocabulary and authoring conventions for readable Collet code.',
    searchTerms: ['variant', 'intent', 'shape', 'size', 'tokens', 'forms'],
  },
  {
    id: 'migrating-from-shadcn-ui',
    title: 'Migrating from shadcn/ui',
    href: '/docs/migrating-from-shadcn-ui',
    description: 'Map shadcn/ui and underlying Radix patterns to Collet’s typed component layer, tokens, and lower-context workflow.',
    searchTerms: ['shadcn', 'radix', 'migration', 'tailwind', 'copied components', 'components/ui'],
  },
  {
    id: 'theming',
    title: 'Theming',
    href: '/docs/theming',
    description: 'Theme Collet with CSS custom properties, dark-mode tokens, and ::part() selectors.',
    searchTerms: ['design tokens', 'css variables', 'parts', 'theme', 'dark mode', 'data-theme'],
  },
];

export const componentCategories = [
  { title: 'Layout', ids: ['card', 'text', 'sidebar', 'collapsible', 'avatar', 'scrollbar', 'carousel'] },
  { title: 'Actions', ids: ['button', 'badge', 'toggle-group', 'split-button', 'fab', 'speed-dial'] },
  { title: 'Form Inputs', ids: ['text-input', 'select', 'autocomplete', 'checkbox', 'switch', 'radio-group', 'slider', 'chat-input', 'date-picker', 'search-bar', 'file-upload'] },
  { title: 'Navigation', ids: ['tabs', 'accordion', 'breadcrumb', 'menu', 'pagination', 'table', 'listbox', 'stepper', 'profile-menu'] },
  { title: 'Feedback', ids: ['alert', 'toast', 'progress', 'spinner', 'skeleton', 'thinking'] },
  { title: 'Overlays', ids: ['dialog', 'drawer', 'popover', 'tooltip', 'backdrop'] },
  { title: 'Data Display', ids: ['message-bubble', 'message-group', 'message-part', 'activity-group', 'code-block'] },
] as const satisfies ReadonlyArray<{ title: string; ids: ReadonlyArray<ComponentId> }>;

export const allComponentIds: ComponentId[] = componentCategories.flatMap((category) => [...category.ids]);
export const totalComponentCount = allComponentIds.length;

export function getComponentHref(id: ComponentId): string {
  return `/docs/components/${id}`;
}

export function getComponentExportHref(id: ComponentId): string {
  return `/ai/components/${id}.json`;
}

function getComponentMeta(id: ComponentId) {
  const meta = componentDocs[id];
  if (!meta) {
    throw new Error(`Missing component docs for "${id}"`);
  }
  return meta;
}

function getGuideGroup(page: GuidePageMeta): string {
  return page.group ?? 'Getting Started';
}

export const navigation: NavGroup[] = [
  {
    title: 'Getting Started',
    items: guidePages
      .filter((page) => getGuideGroup(page) === 'Getting Started')
      .map((page) => ({ label: page.title, href: page.href })),
  },
  ...componentCategories.map((category) => ({
    title: category.title,
    items: [
      ...guidePages
        .filter((page) => getGuideGroup(page) === category.title)
        .map((page) => ({ label: page.title, href: page.href })),
      ...category.ids.map((id) => ({
        label: getComponentMeta(id).title,
        href: getComponentHref(id),
      })),
    ],
  })),
];

export const landingComponentCategories = componentCategories.map((category) => ({
  label: category.title,
  count: category.ids.length,
  href: getComponentHref(category.ids[0]!),
}));

export const searchIndex: SearchEntry[] = [
  ...guidePages.map((page) => ({
    label: page.title,
    href: page.href,
    group: getGuideGroup(page),
    description: page.description,
    keywords: [page.id, page.title.toLowerCase(), ...(page.searchTerms ?? [])],
  })),
  ...componentCategories.flatMap((category) =>
    category.ids.map((id) => {
      const meta = getComponentMeta(id);
      return {
        label: meta.title,
        href: getComponentHref(id),
        group: category.title,
        description: meta.description,
        keywords: [
          id,
          meta.importName,
          meta.category,
          ...(meta.variants ?? []),
          ...(meta.shapes ?? []),
          ...(meta.intents ?? []),
        ],
      };
    }),
  ),
];
