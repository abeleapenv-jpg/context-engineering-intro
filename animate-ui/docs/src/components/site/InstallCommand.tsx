/*
 * InstallCommand - terminal-style command block with animated copy
 * feedback.
 */
import { CopyButton } from './CopyButton';

export function InstallCommand({ command }: { command: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card px-4 py-3">
      <code className="overflow-x-auto whitespace-nowrap text-[13px] text-foreground">
        <span className="text-muted-foreground">$ </span>
        {command}
      </code>
      <CopyButton text={command} />
    </div>
  );
}
