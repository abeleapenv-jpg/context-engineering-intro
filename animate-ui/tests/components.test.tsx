/*
 * Component behavior: rendering, interaction, aria, reduced motion.
 */
import {
  act,
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Button } from '../components/ui/button';
import { Card, CardDescription, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Tooltip } from '../components/ui/tooltip';

function renderAccordion(props: { reducedMotion?: boolean } = {}) {
  if (props.reducedMotion) {
    window.matchMedia = ((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
  }
  return render(
    <Accordion type="single" collapsible>
      <AccordionItem value="a">
        <AccordionTrigger>First</AccordionTrigger>
        <AccordionContent>First content</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Second</AccordionTrigger>
        <AccordionContent>Second content</AccordionContent>
      </AccordionItem>
    </Accordion>,
  );
}

describe('button', () => {
  it('renders variants and sizes as classes', () => {
    render(
      <>
        <Button variant="destructive" size="lg">
          Delete
        </Button>
        <Button variant="ghost">Ghost</Button>
      </>,
    );
    expect(screen.getByText('Delete')).toHaveClass('bg-destructive');
    expect(screen.getByText('Ghost')).toHaveClass('hover:bg-accent');
  });

  it('passes through native props', () => {
    render(<Button disabled>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });
});

describe('card', () => {
  it('composes header content', () => {
    render(
      <Card>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});

describe('skeleton', () => {
  it('renders as a loading placeholder hidden from screen readers', () => {
    render(<Skeleton data-testid="skeleton" />);
    const skeleton = screen.getByTestId('skeleton');
    expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    expect(skeleton).toHaveClass('animate-pulse');
  });
});

describe('accordion', () => {
  it('opens one item at a time and toggles aria-expanded', async () => {
    renderAccordion();
    const first = screen.getByRole('button', { name: 'First' });
    expect(first).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('First content')).not.toBeInTheDocument();

    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('First content')).toBeInTheDocument();

    // Opening the second closes the first (type single). The exiting
    // content finishes its 200ms exit animation, then leaves the DOM.
    fireEvent.click(screen.getByRole('button', { name: 'Second' }));
    await waitForElementToBeRemoved(() => screen.queryByText('First content'));
    expect(screen.getByText('Second content')).toBeInTheDocument();
  });

  it('opens instantly under reduced motion (content still present)', () => {
    renderAccordion({ reducedMotion: true });
    fireEvent.click(screen.getByRole('button', { name: 'First' }));
    expect(screen.getByText('First content')).toBeInTheDocument();
  });

  it('accepts a duration prop for the animation speed', () => {
    render(
      <Accordion type="single" collapsible duration={0.05}>
        <AccordionItem value="a">
          <AccordionTrigger>Speedy</AccordionTrigger>
          <AccordionContent>Speedy content</AccordionContent>
        </AccordionItem>
      </Accordion>,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Speedy' }));
    expect(screen.getByText('Speedy content')).toBeInTheDocument();
  });
});

describe('tooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('appears after the delay on hover and hides on Escape', () => {
    render(
      <Tooltip content="Helpful hint">
        <button type="button">Hover me</button>
      </Tooltip>,
    );
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Hover me' }));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(250);
    });
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Helpful hint');
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', tooltip.id);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows on keyboard focus', () => {
    render(
      <Tooltip content="Focus hint">
        <button type="button">Focus me</button>
      </Tooltip>,
    );
    fireEvent.focus(screen.getByRole('button', { name: 'Focus me' }));
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Focus hint');
  });
});
