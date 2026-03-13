import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DocsSidebar } from '../components/DocsSidebar';
import { DocsHeader } from '../components/DocsHeader';
import { Scrollbar } from '@colletdev/react';
import {
  COLLET_LICENSE_URL,
  COLLET_RELEASES_URL,
  COLLET_REPO_URL,
  DOCS_JSON_INDEX_URL,
  DOCS_LLM_INDEX_URL,
} from '../docs/registry';

interface DocsLayoutProps {
  /** Full-width mode hides sidebar/TOC — used for landing page */
  fullWidth?: boolean;
  children: ReactNode;
}

export function DocsLayout({
  fullWidth = false,
  children,
}: DocsLayoutProps) {
  const articleScrollRef = useRef<HTMLElement>(null);
  const articleInnerRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const [tocItems, setTocItems] = useState<Array<{ id: string; label: string; level: number }>>([]);
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);

  const getViewport = useCallback(() => {
    const el = articleScrollRef.current;
    return el?.shadowRoot?.querySelector<HTMLElement>('[data-scrollbar-viewport]') ?? null;
  }, []);

  const scrollToHeading = useCallback((id: string, behavior: ScrollBehavior = 'smooth') => {
    const root = articleInnerRef.current;
    const viewport = getViewport();
    if (!root || !viewport) return;

    const selector = window.CSS?.escape ? `#${window.CSS.escape(id)}` : `#${id}`;
    const heading = root.querySelector<HTMLElement>(selector);
    if (!heading) return;

    const viewportRect = viewport.getBoundingClientRect();
    const headingRect = heading.getBoundingClientRect();
    const nextTop = viewport.scrollTop + headingRect.top - viewportRect.top - 12;
    viewport.scrollTo({ top: nextTop, behavior });
  }, [getViewport]);

  useEffect(() => {
    if (fullWidth) {
      setTocItems([]);
      return undefined;
    }

    setCurrentHash(window.location.hash);

    const frame = window.requestAnimationFrame(() => {
      const headings = Array.from(
        articleInnerRef.current?.querySelectorAll<HTMLElement>('[data-doc-heading="true"]') ?? [],
      ).map((heading) => ({
        id: heading.id,
        label: heading.dataset.docLabel ?? heading.textContent?.trim() ?? heading.id,
        level: Number(heading.dataset.docLevel ?? '2'),
      }));

      setTocItems(headings);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [fullWidth, pathname]);

  useEffect(() => {
    const handleHashChange = () => setCurrentHash(window.location.hash);
    const handleHeadingRequest = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      if (customEvent.detail) {
        scrollToHeading(customEvent.detail);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('docs-scroll-to-heading', handleHeadingRequest as EventListener);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('docs-scroll-to-heading', handleHeadingRequest as EventListener);
    };
  }, [scrollToHeading]);

  useEffect(() => {
    const viewport = getViewport();
    if (!viewport) return;

    if (!currentHash) {
      viewport.scrollTop = 0;
      return;
    }

    const id = decodeURIComponent(currentHash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      scrollToHeading(id, 'auto');
    });
    return () => window.cancelAnimationFrame(frame);
  }, [currentHash, getViewport, pathname, scrollToHeading]);

  return (
    <div className="docs-shell">
      <header className="docs-header">
        <div className="docs-header-inner">
          <DocsHeader />
        </div>
      </header>

      {fullWidth ? (
        <main className="docs-full">{children}</main>
      ) : (
        <div className="docs-content">
          <aside className="docs-sidebar" aria-label="Documentation navigation">
            <Scrollbar track="floating" size="sm" height="fill">
              <DocsSidebar />
            </Scrollbar>
          </aside>

          <main className="docs-article">
            <Scrollbar ref={articleScrollRef} track="floating" size="sm" height="fill">
              <div ref={articleInnerRef} className="docs-article-inner">
                {children}
              </div>
            </Scrollbar>
          </main>

          {tocItems.length > 0 && (
            <aside className="docs-toc" aria-label="On this page">
              <Scrollbar track="floating" size="sm" height="fill">
                <nav className="docs-toc-nav" aria-label="On this page">
                  <p className="docs-toc-title">On this page</p>
                  <ul className="docs-toc-list">
                    {tocItems.map((item) => {
                      const active = currentHash === `#${item.id}`;
                      return (
                        <li key={item.id}>
                          <a
                            href={`#${item.id}`}
                            className={`docs-toc-link${active ? ' docs-toc-link--active' : ''}`}
                            data-level={item.level}
                            onClick={(event) => {
                              event.preventDefault();
                              window.location.hash = item.id;
                              window.dispatchEvent(new CustomEvent('docs-scroll-to-heading', { detail: item.id }));
                            }}
                          >
                            {item.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </nav>
              </Scrollbar>
            </aside>
          )}
        </div>
      )}

      <footer className="docs-footer">
        <div className="docs-footer-inner">
          <div className="docs-footer-content">
            <p className="docs-footer-text">
              Built with Collet — zero-hydration components from Rust.
            </p>
            <div className="docs-footer-links">
              <a href={COLLET_REPO_URL} className="docs-footer-link">GitHub</a>
              <span className="docs-footer-sep" aria-hidden="true">/</span>
              <a href={COLLET_RELEASES_URL} className="docs-footer-link">Releases</a>
              <span className="docs-footer-sep" aria-hidden="true">/</span>
              <a href={COLLET_LICENSE_URL} className="docs-footer-link">License</a>
              <span className="docs-footer-sep" aria-hidden="true">/</span>
              <a href={DOCS_LLM_INDEX_URL} className="docs-footer-link">LLMs.txt</a>
              <span className="docs-footer-sep" aria-hidden="true">/</span>
              <a href={DOCS_JSON_INDEX_URL} className="docs-footer-link">JSON Index</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
