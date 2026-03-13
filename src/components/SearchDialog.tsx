import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { searchIndex, type SearchEntry } from '../docs/registry';

function matchScore(result: SearchEntry, query: string): number {
  const q = query.toLowerCase();
  const label = result.label.toLowerCase();
  const desc = result.description.toLowerCase();
  const group = result.group.toLowerCase();
  const keywords = result.keywords.map((keyword) => keyword.toLowerCase());

  if (label === q) return 100;
  if (label.startsWith(q)) return 80;
  if (label.includes(q)) return 60;
  if (keywords.some((keyword) => keyword === q)) return 55;
  if (keywords.some((keyword) => keyword.includes(q))) return 45;
  if (group.includes(q)) return 40;
  if (desc.includes(q)) return 20;
  return 0;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const navigate = useNavigate();

  const index = useMemo(() => searchIndex, []);

  const results = useMemo(() => {
    if (!query.trim()) return index.slice(0, 12);
    return index
      .map((r) => ({ ...r, score: matchScore(r, query.trim()) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query, index]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      // Small delay to ensure the dialog is mounted
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.children[activeIndex] as HTMLElement | undefined;
    active?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const go = useCallback(
    (href: string) => {
      onClose();
      navigate(href);
    },
    [navigate, onClose],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((i) => Math.min(i + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((i) => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[activeIndex]) go(results[activeIndex].href);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    },
    [results, activeIndex, go, onClose],
  );

  if (!open) return null;

  return createPortal(
    <div className="search-overlay" onClick={onClose} role="presentation">
      <div
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search documentation"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="search-input-wrap">
          <svg
            width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true"
            className="search-icon"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search docs and components..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={results[activeIndex] ? `search-item-${activeIndex}` : undefined}
          />
          <kbd className="search-esc">Esc</kbd>
        </div>

        {results.length > 0 ? (
          <ul id="search-results" ref={listRef} className="search-results" role="listbox">
            {results.map((r, i) => (
              <li
                key={r.href}
                id={`search-item-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                className={`search-result-item${i === activeIndex ? ' search-result-item--active' : ''}`}
                onClick={() => go(r.href)}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <span className="search-result-label">{r.label}</span>
                <span className="search-result-group">{r.group}</span>
                {r.description && (
                  <span className="search-result-desc">{r.description}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="search-empty">No results for &ldquo;{query}&rdquo;</div>
        )}

        <div className="search-footer">
          <span><kbd>&uarr;</kbd><kbd>&darr;</kbd> Navigate</span>
          <span><kbd>Enter</kbd> Open</span>
          <span><kbd>Esc</kbd> Close</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
