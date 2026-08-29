/*
 * Dialog behavior: portal composition, focus, Escape, backdrop.
 */
import {
  fireEvent,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

function DialogHarness({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your preferences.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe('dialog', () => {
  it('keeps the trigger inline and slots content into the portal panel', () => {
    render(<DialogHarness />);
    // Closed: trigger visible, no dialog in the DOM.
    expect(screen.getByRole('button', { name: 'Open dialog' })).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveTextContent('Settings');
    // The trigger is NOT inside the portal panel.
    expect(dialog).not.toHaveTextContent('Open dialog');
  });

  it('closes on Escape and via the close button', async () => {
    render(<DialogHarness defaultOpen />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    // The 150ms exit animation completes, then the panel leaves the DOM.
    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));

    fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    await waitForElementToBeRemoved(() => screen.queryByRole('dialog'));
  });

  it('wires aria-labelledby and aria-describedby to title and description', () => {
    render(<DialogHarness defaultOpen />);
    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('Settings');
    const description = screen.getByText('Manage your preferences.');
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(dialog.getAttribute('aria-describedby')).toBe(description.id);
  });

  it('traps Tab focus inside the panel', () => {
    function TrapHarness() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Trap</DialogTitle>
            </DialogHeader>
            <input aria-label="Name" placeholder="Name" />
            <DialogFooter>
              <DialogClose>Close</DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }
    render(<TrapHarness />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));

    const close = screen.getByRole('button', { name: 'Close' });
    const input = screen.getByRole('textbox', { name: 'Name' });

    // Forward Tab from the last focusable wraps to the first.
    close.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(input);

    // Shift+Tab from the first focusable wraps back to the last.
    input.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(close);
  });

  it('reports open changes through onOpenChange', () => {
    const onOpenChange = vi.fn();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            onOpenChange(next);
          }}
        >
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Controlled</DialogTitle>
          </DialogContent>
        </Dialog>
      );
    }
    render(<Controlled />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
