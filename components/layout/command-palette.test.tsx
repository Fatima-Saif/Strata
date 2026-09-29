import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from './command-palette';
import { useCommandStore } from '@/lib/store/command-store';
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe('CommandPalette', () => {
  beforeEach(() => {
    // Force open
    useCommandStore.setState({ isOpen: true });
  });

  it('renders command palette when open', () => {
    render(<CommandPalette />);
    expect(screen.getByPlaceholderText(/Type a command or search/i)).toBeInTheDocument();
  });

  it('filters results based on input', async () => {
    render(<CommandPalette />);
    const input = screen.getByPlaceholderText(/Type a command or search/i);
    await userEvent.type(input, 'settings');
    // Ensure Settings item appears
    expect(await screen.findByText('Settings')).toBeInTheDocument();
  });
});
