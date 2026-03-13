import { useCallback, useEffect, useState } from 'react';
import { Button, Tooltip } from '@colletdev/react';

interface DocsCopyButtonProps {
  value: string;
  label?: string;
  variant?: 'ghost' | 'outline' | 'filled';
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

export function DocsCopyButton({
  value,
  label = 'Copy',
  variant = 'ghost',
}: DocsCopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    copyText(value).then(() => setCopied(true)).catch(() => undefined);
  }, [value]);

  useEffect(() => {
    if (!copied) return undefined;
    const timeout = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const button = (
    <Button
      label={label}
      variant={variant}
      size="sm"
      iconLeading={copied ? 'check' : 'copy'}
      onClick={handleCopy}
    />
  );

  if (!copied) {
    return button;
  }

  return (
    <Tooltip content="There you go!" position="bottom" arrow={false} openDelay={0}>
      <span className="docs-copy-button-wrap">{button}</span>
    </Tooltip>
  );
}
