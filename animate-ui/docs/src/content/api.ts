/*
 * Props API reference tables and accessibility notes for all six
 * components. Authored from the actual component sources so the docs
 * match what ships (a test enforces completeness).
 */

export interface PropRow {
  name: string;
  type: string;
  defaultValue: string;
  description: string;
}

export interface ApiDoc {
  props: PropRow[];
  note?: string;
}

export const PROPS_API: Record<string, ApiDoc> = {
  button: {
    props: [
      {
        name: 'variant',
        type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'",
        defaultValue: "'default'",
        description: 'Visual style, driven by class-variance-authority.',
      },
      {
        name: 'size',
        type: "'default' | 'sm' | 'lg' | 'icon'",
        defaultValue: "'default'",
        description: 'Height and padding. The icon size is square.',
      },
      {
        name: 'className',
        type: 'string',
        defaultValue: 'undefined',
        description: 'Merged after variant classes via cn(), so overrides win.',
      },
    ],
    note: 'All motion.button props are forwarded. The press scale is skipped under prefers-reduced-motion.',
  },
  card: {
    props: [
      {
        name: 'Card',
        type: 'React.ComponentProps<"div">',
        defaultValue: '-',
        description: 'The container: rounded-xl border, card tokens.',
      },
      {
        name: 'CardHeader / CardFooter',
        type: 'React.ComponentProps<"div">',
        defaultValue: '-',
        description: 'Padded header and footer rows.',
      },
      {
        name: 'CardTitle',
        type: 'React.ComponentProps<"h3">',
        defaultValue: '-',
        description: 'Semibold heading.',
      },
      {
        name: 'CardDescription',
        type: 'React.ComponentProps<"p">',
        defaultValue: '-',
        description: 'Muted supporting text.',
      },
      {
        name: 'CardContent',
        type: 'React.ComponentProps<"div">',
        defaultValue: '-',
        description: 'Body area, top padding trimmed.',
      },
    ],
    note: 'Card is deliberately static: it carries no animation on purpose.',
  },
  accordion: {
    props: [
      {
        name: 'type',
        type: "'single' | 'multiple'",
        defaultValue: "'single'",
        description: 'One item open at a time, or several.',
      },
      {
        name: 'collapsible',
        type: 'boolean',
        defaultValue: 'true',
        description: 'Single mode only: allows closing the open item.',
      },
      {
        name: 'defaultValue',
        type: 'string | string[]',
        defaultValue: 'undefined',
        description: 'Item value(s) open on first render.',
      },
      {
        name: 'duration',
        type: 'number',
        defaultValue: '0.2',
        description: 'Seconds for the height animation. 0 opens instantly.',
      },
      {
        name: 'AccordionItem.value',
        type: 'string',
        defaultValue: 'required',
        description: 'Unique value identifying the item.',
      },
    ],
    note: 'AccordionTrigger and AccordionContent forward native button/div props.',
  },
  dialog: {
    props: [
      {
        name: 'open',
        type: 'boolean',
        defaultValue: 'required',
        description: 'Controlled: whether the dialog is visible.',
      },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        defaultValue: 'required',
        description: 'Called on Escape, backdrop click, and close buttons.',
      },
      {
        name: 'duration',
        type: 'number',
        defaultValue: '0.15',
        description: 'Seconds for the fade and scale transitions.',
      },
      {
        name: 'DialogContent',
        type: 'children',
        defaultValue: '-',
        description: 'Slots its children into the portal panel.',
      },
      {
        name: 'DialogTitle / DialogDescription',
        type: 'React.ComponentProps<"h2" | "p">',
        defaultValue: '-',
        description: 'Wire aria-labelledby and aria-describedby automatically.',
      },
    ],
    note: 'Focus moves into the panel on open, Tab is trapped within it, and focus returns to the trigger on close.',
  },
  skeleton: {
    props: [
      {
        name: 'className',
        type: 'string',
        defaultValue: 'undefined',
        description: 'Shape the placeholder: h-4 w-3/4, rounded-full, and so on.',
      },
    ],
    note: 'Skeleton forwards div props and renders aria-hidden; the pulse is pure CSS (animate-pulse).',
  },
  tooltip: {
    props: [
      {
        name: 'content',
        type: 'ReactNode',
        defaultValue: 'required',
        description: 'The tooltip text or markup.',
      },
      {
        name: 'side',
        type: "'top' | 'bottom' | 'left' | 'right'",
        defaultValue: "'top'",
        description: 'Which side of the trigger the tooltip appears on.',
      },
      {
        name: 'duration',
        type: 'number',
        defaultValue: '0.15',
        description: 'Seconds for the fade.',
      },
      {
        name: 'delayDuration (TooltipProvider)',
        type: 'number',
        defaultValue: '200',
        description: 'Milliseconds before the tooltip shows.',
      },
    ],
    note: 'The trigger keeps its own element type; aria-describedby is applied to the focusable element.',
  },
};

export interface A11yRow {
  feature: string;
  behavior: string;
}

export const ACCESSIBILITY: Record<string, A11yRow[]> = {
  button: [
    {
      feature: 'Activation',
      behavior: 'Enter and Space activate a focused button, natively.',
    },
    {
      feature: 'Focus ring',
      behavior: 'Visible ring on keyboard focus; disabled buttons are unfocusable and at 50% opacity.',
    },
    {
      feature: 'Reduced motion',
      behavior: 'The whileTap scale is skipped under prefers-reduced-motion.',
    },
  ],
  card: [
    {
      feature: 'Semantics',
      behavior: 'Card renders a plain div; titles are real h3 headings so screen readers keep the document outline.',
    },
    {
      feature: 'Motion',
      behavior: 'Deliberately static. No motion to reduce.',
    },
  ],
  accordion: [
    {
      feature: 'Activation',
      behavior: 'Enter and Space toggle a focused trigger.',
    },
    {
      feature: 'Keyboard navigation',
      behavior: 'Tab moves between triggers; content never traps focus.',
    },
    {
      feature: 'ARIA',
      behavior: 'Triggers expose aria-expanded and aria-controls pointing at the content id.',
    },
    {
      feature: 'Reduced motion',
      behavior: 'Content mounts and unmounts instantly with no height animation.',
    },
  ],
  dialog: [
    {
      feature: 'Opening',
      behavior: 'Enter and Space on the trigger open the dialog; focus moves into the panel.',
    },
    {
      feature: 'Focus trap',
      behavior: 'Tab and Shift+Tab cycle through the panel; focus never escapes to the page behind.',
    },
    {
      feature: 'Closing',
      behavior: 'Escape, the backdrop click, and DialogClose all close; focus returns to the trigger.',
    },
    {
      feature: 'ARIA',
      behavior: 'role="dialog", aria-modal, aria-labelledby, and aria-describedby are wired from DialogTitle and DialogDescription.',
    },
    {
      feature: 'Reduced motion',
      behavior: 'Fade and scale are replaced by an instant appear/disappear.',
    },
  ],
  skeleton: [
    {
      feature: 'Screen readers',
      behavior: 'Rendered with aria-hidden: placeholders carry no information.',
    },
    {
      feature: 'Motion',
      behavior: 'The pulse is a CSS animation and is skipped by browsers honoring reduced motion.',
    },
  ],
  tooltip: [
    {
      feature: 'Showing',
      behavior: 'Shows on hover and keyboard focus, after the configured delay.',
    },
    {
      feature: 'Dismissing',
      behavior: 'Hides on mouse leave, blur, and Escape.',
    },
    {
      feature: 'ARIA',
      behavior: 'role="tooltip" with aria-describedby on the focusable trigger.',
    },
    {
      feature: 'Reduced motion',
      behavior: 'Appears instantly with no offset animation.',
    },
  ],
};
