import { CodeBlock } from '@colletdev/react';

interface ComponentDocCodeBlockProps {
  content: string;
  language?: string;
  filename?: string;
}

export function ComponentDocCodeBlock({
  content,
  language,
  filename,
}: ComponentDocCodeBlockProps) {
  return (
    <CodeBlock
      content={content}
      language={language}
      filename={filename}
      copyButton
      className="docs-component-code"
    />
  );
}
