'use client';

import React, { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa6';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  // Parse content into blocks: code blocks, headings, blockquotes, lists, paragraphs
  const renderFormattedText = (text: string) => {
    // Replace inline code `code`
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g);

    return parts.map((part, index) => {
      if (!part) return null;

      // Inline code
      if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 rounded text-[11px] font-mono bg-neon-blue/10 text-neon-blue border border-neon-blue/20"
          >
            {part.slice(1, -1)}
          </code>
        );
      }

      // Bold
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return (
          <strong key={index} className="font-semibold text-[var(--text-main)]">
            {part.slice(2, -2)}
          </strong>
        );
      }

      // Italic
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
        return (
          <em key={index} className="italic text-secondary">
            {part.slice(1, -1)}
          </em>
        );
      }

      // Markdown links: [label](url)
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return (
          <a
            key={index}
            href={linkMatch[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neon-blue underline hover:text-neon-purple transition-colors font-medium"
          >
            {linkMatch[1]}
          </a>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Fenced Code Block
    if (line.trim().startsWith('```')) {
      const language = line.trim().replace(/^```/, '') || 'code';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      const codeString = codeLines.join('\n');

      elements.push(
        <CodeBlock key={`code-${i}`} code={codeString} language={language} />
      );
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="font-display font-bold text-2xl sm:text-3xl text-[var(--text-main)] mt-6 mb-3">
          {renderFormattedText(line.replace(/^#\s+/, ''))}
        </h1>
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="font-display font-semibold text-xl sm:text-2xl text-neon-blue mt-5 mb-2.5">
          {renderFormattedText(line.replace(/^##\s+/, ''))}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="font-display font-medium text-base sm:text-lg text-neon-purple mt-4 mb-2">
          {renderFormattedText(line.replace(/^###\s+/, ''))}
        </h3>
      );
      i++;
      continue;
    }

    if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${i}`} className="font-sans font-semibold text-sm text-[var(--text-main)] mt-3 mb-1.5">
          {renderFormattedText(line.replace(/^####\s+/, ''))}
        </h4>
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      elements.push(
        <blockquote
          key={`quote-${i}`}
          className="border-l-2 border-neon-blue pl-4 py-1.5 my-3 bg-neon-blue/5 rounded-r-xl italic text-xs sm:text-sm text-secondary"
        >
          {renderFormattedText(line.replace(/^>\s+/, ''))}
        </blockquote>
      );
      i++;
      continue;
    }

    // Unordered List (- or *)
    if (/^\s*[-*]\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} className="space-y-1.5 my-2.5 pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-secondary">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-blue flex-shrink-0 mt-2" />
              <div className="leading-relaxed">{renderFormattedText(item)}</div>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered List (1. 2.)
    if (/^\s*\d+\.\s+/.test(line)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        listItems.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} className="space-y-1.5 my-2.5 pl-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-secondary">
              <span className="mono-label text-[11px] text-neon-purple font-mono flex-shrink-0 mt-0.5">
                {idx + 1}.
              </span>
              <div className="leading-relaxed">{renderFormattedText(item)}</div>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line
    if (!line.trim()) {
      elements.push(<div key={`empty-${i}`} className="h-2" />);
      i++;
      continue;
    }

    // Normal Paragraph
    elements.push(
      <p key={`p-${i}`} className="leading-relaxed text-xs sm:text-sm text-secondary my-1.5">
        {renderFormattedText(line)}
      </p>
    );
    i++;
  }

  return (
    <div className={`prose-glass ${className}`}>
      {elements}
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative group my-4 rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-xl">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5 text-[11px] font-mono text-secondary">
        <span className="text-neon-blue uppercase tracking-wider">{language}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors cursor-pointer"
        >
          {copied ? (
            <>
              <FaCheck className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400 text-[10px]">Copied</span>
            </>
          ) : (
            <>
              <FaCopy className="w-3 h-3 text-secondary group-hover:text-white" />
              <span className="text-[10px]">Copy code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <pre className="p-4 overflow-x-auto text-xs font-mono text-slate-200 leading-relaxed scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}
