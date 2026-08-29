/*
 * InstallCommand - terminal-style command block with copy.
 */
import { useState } from 'react';

export function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
      <code className="overflow-x-auto whitespace-nowrap text-[13px] text-foreground">
        <span className="text-muted-foreground">$ </span>
        {command}
      </code>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        aria-label="Copy command"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}
