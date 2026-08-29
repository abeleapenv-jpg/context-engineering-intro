/*
 * CodeBlock - filename, copy button, and a small tokenizer highlighter
 * (no syntax library shipped; this is for component source, which is
 * short and regular).
 */
import { useState } from 'react';

interface Token {
  text: string;
  className?: string;
}

const TOKEN = new RegExp(
  [
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)', // comments
    "(?:'(?:[^'\\\\\\n]|\\\\.)*'|\"(?:[^\"\\\\\\n]|\\\\.)*\"|`(?:[^`\\\\]|\\\\.)*`)", // strings
    '\\b(import|export|from|default|const|let|var|function|return|type|interface|extends|new|as|typeof|if|else|for|of|in|switch|case|break|continue|class|null|undefined|true|false|await|async|satisfies)\\b', // keywords
    '\\b(\\d+(?:\\.\\d+)?)\\b', // numbers
    '(<\\/?[A-Za-z][\\w.]*|\\/?>)', // jsx tags
  ].join('|'),
  'g',
);

const CLASS_FOR_GROUP = {
  1: 'text-zinc-500 italic',
  2: 'text-emerald-400',
  3: 'text-violet-400',
  4: 'text-amber-300',
  5: 'text-sky-400',
} as const;

export function highlight(code: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const match of code.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) tokens.push({ text: code.slice(last, index) });
    let className: string | undefined;
    for (const group of [1, 2, 3, 4, 5] as const) {
      if (match[group] !== undefined) {
        className = CLASS_FOR_GROUP[group];
        break;
      }
    }
    tokens.push({ text: match[0], className });
    last = index + match[0].length;
  }
  if (last < code.length) tokens.push({ text: code.slice(last) });
  return tokens;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
      aria-label="Copy code"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function CodeBlock({
  code,
  filename,
}: {
  code: string;
  filename?: string;
}) {
  const tokens = highlight(code);
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs text-muted-foreground">{filename ?? 'component.tsx'}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed">
        <code>
          {tokens.map((token, i) => (
            <span key={i} className={token.className}>
              {token.text}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
