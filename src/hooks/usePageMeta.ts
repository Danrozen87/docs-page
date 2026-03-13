import { useEffect } from 'react';

const SITE_TITLE = 'Collet Docs';

function ensureMetaTag(name: string, attribute: 'name' | 'property' = 'name') {
  const selector = `meta[${attribute}="${name}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  return tag;
}

function ensureCanonicalLink() {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.rel = 'canonical';
    document.head.appendChild(link);
  }
  return link;
}

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = title === SITE_TITLE ? SITE_TITLE : `${title} | ${SITE_TITLE}`;

    ensureMetaTag('description').content = description;
    ensureMetaTag('og:title', 'property').content = document.title;
    ensureMetaTag('og:description', 'property').content = description;

    const canonical = ensureCanonicalLink();
    canonical.href = `${window.location.origin}${window.location.pathname}${window.location.hash}`;
  }, [title, description]);
}
