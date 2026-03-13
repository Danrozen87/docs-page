import { CodeBlock } from '@colletdev/react';

interface DocsCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showToolbar?: boolean;
}

export function DocsCodeBlock({ code, language, filename }: DocsCodeBlockProps) {
  return (
    <CodeBlock
      content={code}
      language={language}
      filename={filename}
      copyButton
      className="docs-component-code"
    />
  );
}
