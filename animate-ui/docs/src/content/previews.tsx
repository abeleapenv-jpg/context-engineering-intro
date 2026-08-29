/*
 * Live previews for the docs site. Each preview renders the real
 * component - the same file users copy - driven by real props: variant
 * switches, size toggles, and animation speed/delay controls where the
 * component exposes them (duration props). Card and Skeleton stay
 * deliberately calm.
 */
import { useState, type ReactElement } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Skeleton } from '../../../components/ui/skeleton';
import { Tooltip, TooltipProvider } from '../../../components/ui/tooltip';

function ControlRow({ children }: { children: React.ReactNode }) {
  return <div className="flex w-full flex-wrap items-center justify-center gap-2">{children}</div>;
}

function ControlButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? 'border-foreground/40 bg-foreground/10 text-foreground'
          : 'border-border text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

function ControlGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col items-center gap-2">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </div>
  );
}

function ButtonPreview(): ReactElement {
  const [variant, setVariant] = useState<'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'>('default');
  const [size, setSize] = useState<'default' | 'sm' | 'lg' | 'icon'>('default');
  const [disabled, setDisabled] = useState(false);
  const variants = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
  const sizes = ['default', 'sm', 'lg', 'icon'] as const;
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-6">
      <Button variant={variant} size={size} disabled={disabled}>
        {size === 'icon' ? '→' : 'Get started'}
      </Button>
      <ControlGroup label="Variant">
        <ControlRow>
          {variants.map((v) => (
            <ControlButton key={v} active={v === variant} onClick={() => setVariant(v)}>
              {v}
            </ControlButton>
          ))}
        </ControlRow>
      </ControlGroup>
      <ControlGroup label="Size">
        <ControlRow>
          {sizes.map((s) => (
            <ControlButton key={s} active={s === size} onClick={() => setSize(s)}>
              {s}
            </ControlButton>
          ))}
        </ControlRow>
      </ControlGroup>
      <ControlGroup label="State">
        <ControlRow>
          <ControlButton active={disabled} onClick={() => setDisabled((d) => !d)}>
            disabled
          </ControlButton>
        </ControlRow>
      </ControlGroup>
    </div>
  );
}

function CardPreview(): ReactElement {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Release notes</CardTitle>
        <CardDescription>Motion is feedback, not decoration.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Cards carry structure. Save motion for the components that
        communicate state: presses, disclosures, and focus.
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="outline" size="sm">
          Read more
        </Button>
      </CardFooter>
    </Card>
  );
}

const SPEEDS = [
  { label: 'fast', value: 0.1 },
  { label: 'normal', value: 0.2 },
  { label: 'slow', value: 0.45 },
] as const;

function AccordionPreview(): ReactElement {
  const [type, setType] = useState<'single' | 'multiple'>('single');
  const [collapsible, setCollapsible] = useState(true);
  const [speed, setSpeed] = useState<(typeof SPEEDS)[number]['value']>(0.2);
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <Accordion
        type={type}
        collapsible={collapsible}
        duration={speed}
        className="w-full"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>What is Animate UI?</AccordionTrigger>
          <AccordionContent>
            Animated, accessible React components you copy into your
            project. The code is yours to edit.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How does the CLI work?</AccordionTrigger>
          <AccordionContent>
            It reads the registry and copies component source into your
            project, then prints the dependencies and theme tokens.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>What about reduced motion?</AccordionTrigger>
          <AccordionContent>
            Every animated component checks prefers-reduced-motion and
            falls back to instant state changes.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <ControlGroup label="Type">
        <ControlRow>
          <ControlButton active={type === 'single'} onClick={() => setType('single')}>
            single
          </ControlButton>
          <ControlButton active={type === 'multiple'} onClick={() => setType('multiple')}>
            multiple
          </ControlButton>
          <ControlButton active={collapsible} onClick={() => setCollapsible((c) => !c)}>
            collapsible
          </ControlButton>
        </ControlRow>
      </ControlGroup>
      <ControlGroup label="Animation speed">
        <ControlRow>
          {SPEEDS.map((s) => (
            <ControlButton key={s.label} active={speed === s.value} onClick={() => setSpeed(s.value)}>
              {s.label}
            </ControlButton>
          ))}
        </ControlRow>
      </ControlGroup>
    </div>
  );
}

const DIALOG_SPEEDS = [
  { label: 'fast', value: 0.06 },
  { label: 'normal', value: 0.15 },
  { label: 'slow', value: 0.3 },
] as const;

function DialogPreview(): ReactElement {
  const [open, setOpen] = useState(false);
  const [speed, setSpeed] = useState<(typeof DIALOG_SPEEDS)[number]['value']>(0.15);
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <Dialog open={open} onOpenChange={setOpen} duration={speed}>
        <DialogTrigger className="inline-flex h-9 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Open dialog
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Focus lands here on open. Escape or the backdrop closes the
              dialog, and focus returns to the trigger.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose className="inline-flex h-9 items-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
              Cancel
            </DialogClose>
            <DialogClose className="inline-flex h-9 items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Save changes
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ControlGroup label="Animation speed">
        <ControlRow>
          {DIALOG_SPEEDS.map((s) => (
            <ControlButton key={s.label} active={speed === s.value} onClick={() => setSpeed(s.value)}>
              {s.label}
            </ControlButton>
          ))}
        </ControlRow>
      </ControlGroup>
    </div>
  );
}

function SkeletonPreview(): ReactElement {
  const [loading, setLoading] = useState(true);
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <ControlGroup label="State">
        <ControlRow>
          <ControlButton active={loading} onClick={() => setLoading(true)}>
            loading
          </ControlButton>
          <ControlButton active={!loading} onClick={() => setLoading(false)}>
            content
          </ControlButton>
        </ControlRow>
      </ControlGroup>
      {loading ? (
        <div className="w-full space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : (
        <p className="w-full text-sm text-muted-foreground">
          Loading finished. The skeleton never flashes; it is replaced
          the moment real content is ready.
        </p>
      )}
    </div>
  );
}

const TOOLTIP_DELAYS = [
  { label: '0ms', value: 0 },
  { label: '200ms', value: 200 },
  { label: '800ms', value: 800 },
] as const;

function TooltipPreview(): ReactElement {
  const sides = ['top', 'bottom', 'left', 'right'] as const;
  const [delay, setDelay] = useState(200);
  const [speed, setSpeed] = useState(0.15);
  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-6">
      <TooltipProvider delayDuration={delay}>
        <ControlRow>
          {sides.map((side) => (
            <Tooltip key={side} side={side} duration={speed} content={`Tooltip on the ${side}`}>
              <button
                type="button"
                className="h-9 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {side}
              </button>
            </Tooltip>
          ))}
        </ControlRow>
      </TooltipProvider>
      <ControlGroup label="Show delay">
        <ControlRow>
          {TOOLTIP_DELAYS.map((d) => (
            <ControlButton key={d.label} active={delay === d.value} onClick={() => setDelay(d.value)}>
              {d.label}
            </ControlButton>
          ))}
        </ControlRow>
      </ControlGroup>
      <ControlGroup label="Fade speed">
        <ControlRow>
          {SPEEDS.map((s) => (
            <ControlButton key={s.label} active={speed === s.value} onClick={() => setSpeed(s.value)}>
              {s.label}
            </ControlButton>
          ))}
        </ControlRow>
      </ControlGroup>
    </div>
  );
}

export const PREVIEWS: Record<string, () => ReactElement> = {
  button: ButtonPreview,
  card: CardPreview,
  accordion: AccordionPreview,
  dialog: DialogPreview,
  skeleton: SkeletonPreview,
  tooltip: TooltipPreview,
};
