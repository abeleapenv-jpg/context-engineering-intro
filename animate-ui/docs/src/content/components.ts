/*
 * Component metadata + the actual shipped source code (?raw imports).
 *
 * The code examples on the docs site are the real files users copy -
 * importing them raw means the docs can never drift from the registry.
 */
import accordionSource from '../../../components/ui/accordion.tsx?raw';
import buttonSource from '../../../components/ui/button.tsx?raw';
import cardSource from '../../../components/ui/card.tsx?raw';
import dialogSource from '../../../components/ui/dialog.tsx?raw';
import skeletonSource from '../../../components/ui/skeleton.tsx?raw';
import tooltipSource from '../../../components/ui/tooltip.tsx?raw';

export type Category = 'actions' | 'disclosure' | 'layout' | 'overlay' | 'feedback';

export interface ComponentMeta {
  slug: string;
  name: string;
  description: string;
  category: Category;
  dependencies: string[];
  usage: string;
  source: string;
}

export const COMPONENTS: ComponentMeta[] = [
  {
    slug: 'button',
    name: 'Button',
    description:
      'Six variants and four sizes for actions, with a tactile Motion press that respects reduced motion.',
    category: 'actions',
    dependencies: ['class-variance-authority', 'clsx', 'tailwind-merge', 'motion'],
    usage:
      'Use Button for every action. The press scale is feedback, not decoration - it is skipped automatically under prefers-reduced-motion. Variants are driven by class-variance-authority, so you can add your own in your project.',
    source: buttonSource,
  },
  {
    slug: 'card',
    name: 'Card',
    description:
      'A structured content container. Deliberately static - not every component needs to move.',
    category: 'layout',
    dependencies: ['clsx', 'tailwind-merge'],
    usage:
      'Compose Card with CardHeader, CardTitle, CardDescription, CardContent, and CardFooter. Card carries no animation on purpose: motion belongs where it communicates state.',
    source: cardSource,
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    description:
      'Accessible disclosure with animated height. Single or multiple open items, collapsible.',
    category: 'disclosure',
    dependencies: ['clsx', 'tailwind-merge', 'motion'],
    usage:
      'Wrap AccordionItems in Accordion. type="single" (default) opens one item at a time; type="multiple" allows several. Set collapsible={false} to keep one item always open. Height animates 0 to auto over 200ms; reduced motion opens instantly.',
    source: accordionSource,
  },
  {
    slug: 'dialog',
    name: 'Dialog',
    description:
      'Accessible modal with focus management, Escape and backdrop close, and Motion transitions.',
    category: 'overlay',
    dependencies: ['clsx', 'tailwind-merge', 'motion'],
    usage:
      'Dialog is controlled: pass open and onOpenChange. DialogTrigger and DialogClose render where you place them; DialogContent slots its children into the portal panel. Focus moves into the panel on open and returns to the trigger on close.',
    source: dialogSource,
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    description:
      'Loading placeholder with a quiet CSS pulse. Zero JavaScript animation.',
    category: 'feedback',
    dependencies: ['clsx', 'tailwind-merge'],
    usage:
      'Skeleton is a div with animate-pulse. Use it for any loading state; the pulse is a pure CSS animation so it costs nothing and pauses under prefers-reduced-motion in most setups.',
    source: skeletonSource,
  },
  {
    slug: 'tooltip',
    name: 'Tooltip',
    description:
      'Hover and focus hint with delay, fade, and keyboard dismissal.',
    category: 'feedback',
    dependencies: ['clsx', 'tailwind-merge', 'motion'],
    usage:
      'Wrap any focusable element in Tooltip with a content node and a side. TooltipProvider sets a shared delayDuration. Shows on hover and focus, hides on leave, blur, and Escape. aria-describedby links the tooltip to the trigger.',
    source: tooltipSource,
  },
];

export function getComponent(slug: string): ComponentMeta | undefined {
  return COMPONENTS.find((c) => c.slug === slug);
}

export const CATEGORY_LABELS: Record<Category, string> = {
  actions: 'Actions',
  disclosure: 'Disclosure',
  layout: 'Layout',
  overlay: 'Overlay',
  feedback: 'Feedback',
};
