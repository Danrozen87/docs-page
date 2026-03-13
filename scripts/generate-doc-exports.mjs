import { mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  COLLET_REPO_URL,
  COLLET_VERSION,
  allComponentIds,
  componentCategories,
  getComponentExportHref,
  getComponentHref,
  guidePages,
  totalComponentCount,
} from '../src/docs/registry.ts';
import { componentDocs } from '../src/pages/docs/components/componentData.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const aiDir = path.join(publicDir, 'ai');
const componentsDir = path.join(aiDir, 'components');

const components = allComponentIds.map((id) => ({
  id,
  href: getComponentHref(id),
  exportHref: getComponentExportHref(id),
  ...componentDocs[id],
}));

const docsIndex = {
  generatedAt: new Date().toISOString(),
  name: 'Collet Docs',
  version: COLLET_VERSION,
  repoUrl: COLLET_REPO_URL,
  totalComponentCount,
  guides: guidePages,
  categories: componentCategories.map((category) => ({
    title: category.title,
    ids: [...category.ids],
  })),
  components,
};

const llmsIndex = [
  '# Collet Docs',
  '',
  `Collet is a zero-hydration UI component library with ${totalComponentCount} accessible components compiled to WebAssembly and delivered as Custom Elements.`,
  '',
  `Version: ${COLLET_VERSION}`,
  `Repository: ${COLLET_REPO_URL}`,
  'Machine-readable JSON index: /ai/collet-docs.json',
  '',
  'Guides:',
  ...guidePages.map((page) => `- ${page.href} — ${page.title}: ${page.description}`),
  '',
  'Components by category:',
  ...componentCategories.flatMap((category) => [
    `## ${category.title}`,
    ...category.ids.map((id) => {
      const meta = componentDocs[id];
      return `- ${getComponentHref(id)} — ${meta.title}: ${meta.description}`;
    }),
    '',
  ]),
].join('\n');

await mkdir(aiDir, { recursive: true });
await rm(componentsDir, { recursive: true, force: true });
await mkdir(componentsDir, { recursive: true });

await writeFile(path.join(publicDir, 'llms.txt'), `${llmsIndex}\n`);
await writeFile(path.join(aiDir, 'collet-docs.json'), `${JSON.stringify(docsIndex, null, 2)}\n`);

await Promise.all(
  components.map((component) =>
    writeFile(
      path.join(componentsDir, `${component.id}.json`),
      `${JSON.stringify(component, null, 2)}\n`,
    ),
  ),
);

console.log(`Generated docs exports for ${components.length} components.`);
