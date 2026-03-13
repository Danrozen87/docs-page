import { useCallback, useState } from 'react';
import { Tooltip } from '@colletdev/react';

interface DocsInlineCommandProps {
  command: string;
  ariaLabel?: string;
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}

export function DocsInlineCommand({
  command,
  ariaLabel = 'Copy command',
}: DocsInlineCommandProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    copyText(command).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    }).catch(() => undefined);
  }, [command]);

  return (
    <button
      type="button"
      className={`docs-inline-command${copied ? ' docs-inline-command--copied' : ''}`}
      onClick={handleCopy}
      aria-label={ariaLabel}
    >
      <code className="docs-inline-command-code">{command}</code>
      {copied ? (
        <Tooltip content="There you go!" position="bottom" arrow={false} openDelay={0}>
          <span className="docs-inline-command-icon" aria-hidden="true">
            <svg className="docs-inline-command-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
        </Tooltip>
      ) : (
        <span className="docs-inline-command-icon" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </span>
      )}
    </button>
  );
}
