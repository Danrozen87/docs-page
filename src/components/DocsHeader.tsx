import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Badge, Drawer } from '@colletdev/react';
import { SearchDialog } from './SearchDialog';
import { DocsSidebar } from './DocsSidebar';
import { COLLET_REPO_URL, COLLET_VERSION } from '../docs/registry';

type Theme = 'light' | 'dark';

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    return (document.documentElement.getAttribute('data-theme') as Theme) ?? 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  return { theme, toggle };
}

export function DocsHeader() {
  const { theme, toggle } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Close mobile nav drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const mainNavItems = [
    {
      label: 'Docs',
      href: '/docs/introduction',
      active:
        pathname.startsWith('/docs') &&
        !pathname.startsWith('/docs/components') &&
        !pathname.startsWith('/docs/theming'),
    },
    {
      label: 'Components',
      href: '/docs/components',
      active: pathname.startsWith('/docs/components'),
    },
    {
      label: 'Theming',
      href: '/docs/theming',
      active: pathname.startsWith('/docs/theming') || pathname.startsWith('/docs/dark-mode'),
    },
  ] as const;

  return (
    <>
      {/* Portalled overlays — rendered at body level to escape header stacking context */}
      {searchOpen && createPortal(
        <SearchDialog open={searchOpen} onClose={closeSearch} />,
        document.body,
      )}
      {createPortal(
        <Drawer open={drawerOpen} side="left" size="sm" shape="sharp" title="Navigation" onClose={() => setDrawerOpen(false)}>
          <DocsSidebar />
        </Drawer>,
        document.body,
      )}

      {/* Mobile menu button — visible below 768px */}
      <button
        className="docs-mobile-menu-btn"
        type="button"
        aria-label="Open navigation menu"
        onClick={() => setDrawerOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {/* Logo + version */}
      <Link to="/" className="docs-logo">
        <img src="/collet-logo.svg" alt="" width="53" height="53" className="docs-logo-icon" />
        <span className="docs-logo-mark">Collet</span>
        <Badge label={`v${COLLET_VERSION}`} variant="filled" intent="neutral" size="xs" shape="pill" />
      </Link>

      {/* Navigation links — hidden on mobile */}
      <nav className="docs-header-nav" aria-label="Main">
        {mainNavItems.map((item) => (
          <Button
            key={item.href}
            label={item.label}
            variant="ghost"
            intent={item.active ? 'primary' : 'neutral'}
            size="sm"
            className={`docs-header-link${item.active ? ' docs-header-link--active' : ''}`}
            ariaLabel={item.label}
            onClick={() => navigate(item.href)}
          />
        ))}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Search trigger — Cmd+K style */}
      <button className="docs-search-trigger" type="button" aria-label="Search documentation" onClick={openSearch}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span className="docs-search-text">Search docs...</span>
        <kbd className="docs-search-kbd">
          <abbr title="Command" style={{ textDecoration: 'none' }}>&#8984;</abbr>K
        </kbd>
      </button>

      {/* Action buttons — ensure they don't get cramped */}
      <div className="docs-header-actions">
        <Button
          variant="ghost"
          size="md"
          iconOnly={theme === 'light' ? 'moon' : 'sun'}
          ariaLabel={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          onClick={toggle}
        />
        <Button
          variant="ghost"
          size="md"
          iconOnly="github"
          ariaLabel="View on GitHub"
          kind="link"
          href={COLLET_REPO_URL}
        />
      </div>
    </>
  );
}
