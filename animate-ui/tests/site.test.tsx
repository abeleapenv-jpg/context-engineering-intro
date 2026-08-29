/*
 * Docs site interactions: Cmd+K command palette, mobile drawer, theme
 * toggle, and the animated copy button.
 */
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';

import { AppShell } from '../docs/src/App';

function renderRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AppShell />
    </MemoryRouter>,
  );
}

afterEach(() => {
  localStorage.clear();
});

describe('command palette (Cmd+K)', () => {
  it('opens with Ctrl+K, searches fuzzily, and navigates on selection', () => {
    renderRoute('/');
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const input = screen.getByRole('combobox', {
      name: 'Search documentation',
    });
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'acc' } });
    const option = screen.getByRole('option', { name: /Accordion/ });
    expect(option).toBeInTheDocument();
    expect(option).toHaveAttribute('aria-selected', 'true');

    fireEvent.click(option);
    expect(screen.getByRole('heading', { name: 'Accordion' })).toBeInTheDocument();
  });

  it('opens from the header search button and closes on Escape', async () => {
    renderRoute('/');
    fireEvent.click(screen.getByRole('button', { name: 'Open search' }));
    expect(
      screen.getByRole('combobox', { name: 'Search documentation' }),
    ).toBeInTheDocument();
    fireEvent.keyDown(
      screen.getByRole('combobox', { name: 'Search documentation' }),
      { key: 'Escape' },
    );
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('dialog', { name: 'Search documentation' }),
    );
  });

  it('shows an empty state for unknown queries', () => {
    renderRoute('/');
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    const input = screen.getByRole('combobox', {
      name: 'Search documentation',
    });
    fireEvent.change(input, { target: { value: 'zzzz' } });
    expect(screen.getByText('No results for "zzzz".')).toBeInTheDocument();
  });
});

describe('mobile drawer', () => {
  it('opens from the hamburger, navigates, and closes', async () => {
    renderRoute('/');
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    const drawer = screen.getByRole('dialog', { name: 'Navigation' });
    expect(drawer).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'License' }).length).toBeGreaterThan(0);

    fireEvent.click(drawer.querySelector('a[href="/license"]') as HTMLElement);
    expect(screen.getByRole('heading', { name: 'License' })).toBeInTheDocument();
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('dialog', { name: 'Navigation' }),
    );
  });

  it('closes on Escape', async () => {
    renderRoute('/');
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitForElementToBeRemoved(() =>
      screen.queryByRole('dialog', { name: 'Navigation' }),
    );
  });
});

describe('theme toggle', () => {
  it('flips the dark class and persists the preference', () => {
    renderRoute('/');
    // jsdom starts without the dark class (the index.html pre-paint
    // script does not run in tests), so the initial state is light.
    const toDark = screen.getByRole('button', { name: 'Switch to dark theme' });
    fireEvent.click(toDark);
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('animate-ui-theme')).toBe('dark');
    const toLight = screen.getByRole('button', { name: 'Switch to light theme' });
    fireEvent.click(toLight);
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorage.getItem('animate-ui-theme')).toBe('light');
  });
});
