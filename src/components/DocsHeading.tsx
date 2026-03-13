import type { ReactNode } from 'react';

interface DocsHeadingProps {
  id: string;
  children: ReactNode;
  label?: string;
}

export function DocsHeading({ id, children, label }: DocsHeadingProps) {
  const tocLabel = label ?? (typeof children === 'string' ? children : id);

  return (
    <h2 id={id} data-doc-heading="true" data-doc-level="2" data-doc-label={tocLabel}>
      <a
        href={`#${id}`}
        className="docs-heading-link"
        onClick={(event) => {
          event.preventDefault();
          window.location.hash = id;
          window.dispatchEvent(new CustomEvent('docs-scroll-to-heading', { detail: id }));
        }}
      >
        <span>{children}</span>
        <span className="docs-heading-anchor" aria-hidden="true">#</span>
      </a>
    </h2>
  );
}
