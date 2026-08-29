/*
 * Docs routes: every public route renders, titles are set, unknown
 * routes hit the 404 page, and the detail page exposes tabs, props
 * tables, accessibility notes, breadcrumbs, and prev/next navigation.
 */
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { AppShell } from '../docs/src/App';

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppShell />
    </MemoryRouter>,
  );
}

describe('docs routes', () => {
  it('renders the home page with the hero', () => {
    renderRoute('/');
    expect(
      screen.getByRole('heading', { name: 'Components that move well.' }),
    ).toBeInTheDocument();
    expect(document.title).toContain('Animate UI');
  });

  it('renders the components index with all six components', () => {
    renderRoute('/components');
    expect(screen.getByRole('heading', { name: 'Components' })).toBeInTheDocument();
    for (const name of ['Button', 'Card', 'Accordion', 'Dialog', 'Skeleton', 'Tooltip']) {
      expect(screen.getByText(name)).toBeInTheDocument();
    }
  });

  it('renders a component detail page with preview, breadcrumbs, and titles', () => {
    renderRoute('/components/button');
    expect(screen.getByRole('heading', { name: 'Button' })).toBeInTheDocument();
    expect(
      screen.getByText('Live preview - the real component, not a screenshot.'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Breadcrumb')).toHaveTextContent(
      'Home/Components/Button',
    );
    expect(document.title).toBe('Button - Animate UI');
  });

  it('switches documentation tabs: Code shows the source, Props shows the API table', () => {
    renderRoute('/components/button');
    const codeTab = screen.getByRole('tab', { name: 'Code' });
    fireEvent.click(codeTab);
    expect(codeTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('components/ui/button.tsx')).toBeInTheDocument();

    const propsTab = screen.getByRole('tab', { name: 'Props API' });
    fireEvent.click(propsTab);
    expect(propsTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('columnheader', { name: 'Prop' })).toBeInTheDocument();
    expect(screen.getByText('variant')).toBeInTheDocument();
    // Both variant and size default to 'default'.
    expect(screen.getAllByText("'default'").length).toBeGreaterThan(0);
  });

  it('supports arrow-key navigation between tabs', () => {
    renderRoute('/components/button');
    const tablist = screen.getByRole('tablist');
    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(screen.getByRole('tab', { name: 'Code' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(screen.getByRole('tab', { name: 'Preview' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('renders the accessibility section and prev/next navigation on detail pages', () => {
    renderRoute('/components/button');
    expect(
      screen.getByRole('heading', {
        name: 'Accessibility & Keyboard Interactions',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Activation')).toBeInTheDocument();
    const pagination = screen.getByLabelText('Pagination');
    expect(pagination).toHaveTextContent('Next');
    expect(pagination).toHaveTextContent('Card');
  });

  it('renders the license and contributing pages', () => {
    renderRoute('/license');
    expect(screen.getByRole('heading', { name: 'License' })).toBeInTheDocument();
    expect(screen.getByText(/MIT License/)).toBeInTheDocument();
    renderRoute('/contributing');
    expect(screen.getByRole('heading', { name: 'Contributing' })).toBeInTheDocument();
  });

  it('falls through to the 404 page for unknown routes', () => {
    renderRoute('/definitely-not-a-page');
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(document.title).toContain('Not found');
  });

  it('links GitHub to a real, resolvable URL', () => {
    renderRoute('/');
    const links = screen
      .getAllByRole('link')
      .filter((l) => l.textContent?.includes('GitHub'));
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/^https:\/\/github\.com\//);
    }
  });
});
