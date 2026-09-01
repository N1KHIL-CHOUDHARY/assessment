import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    lines.forEach((line, index) => {
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          elements.push(
            <pre
              key={`code-${index}`}
              className="my-3 p-3.5 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto border border-slate-800"
            >
              <code>{codeBlockContent.join('\n')}</code>
            </pre>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h4 key={index} className="text-sm font-bold text-slate-900 mt-4 mb-1">
            {formatInlineText(line.slice(4))}
          </h4>
        );
        return;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h3 key={index} className="text-base font-bold text-slate-900 mt-5 mb-2 pb-1 border-b border-slate-200">
            {formatInlineText(line.slice(3))}
          </h3>
        );
        return;
      }
      if (line.startsWith('# ')) {
        elements.push(
          <h2 key={index} className="text-lg font-extrabold text-slate-900 mt-5 mb-2">
            {formatInlineText(line.slice(2))}
          </h2>
        );
        return;
      }

      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        elements.push(
          <li key={index} className="ml-4 list-disc text-xs sm:text-sm text-slate-700 my-1 leading-relaxed">
            {formatInlineText(line.trim().slice(2))}
          </li>
        );
        return;
      }

      const numberedMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numberedMatch) {
        elements.push(
          <li key={index} className="ml-4 list-decimal text-xs sm:text-sm text-slate-700 my-1 leading-relaxed">
            {formatInlineText(numberedMatch[2])}
          </li>
        );
        return;
      }

      if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={index}
            className="border-l-4 border-indigo-400 bg-indigo-50/50 pl-3 py-1.5 my-2 text-xs italic text-indigo-900 rounded-r"
          >
            {formatInlineText(line.slice(2))}
          </blockquote>
        );
        return;
      }

      if (!line.trim()) {
        elements.push(<div key={index} className="h-2" />);
        return;
      }

      elements.push(
        <p key={index} className="text-xs sm:text-sm text-slate-700 my-1.5 leading-relaxed">
          {formatInlineText(line)}
        </p>
      );
    });

    if (inCodeBlock && codeBlockContent.length > 0) {
      elements.push(
        <pre
          key="code-final"
          className="my-3 p-3.5 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto"
        >
          <code>{codeBlockContent.join('\n')}</code>
        </pre>
      );
    }

    return elements;
  };

  const formatInlineText = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);

    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-slate-100 text-indigo-700 font-mono text-[11px] font-medium border border-slate-200"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i} className="italic text-slate-800">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return <div className="space-y-0.5">{parseMarkdown(content)}</div>;
};
