import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock minimal @xyflow/react bits used by PlaceholderNode
vi.mock('@xyflow/react', () => ({
  Handle: () => null,
  Position: { Top: 'top', Bottom: 'bottom' },
}));

import { PlaceholderNode } from '@/components/react-flow/placeholder-node';

describe('PlaceholderNode', () => {
  it('renders children content', () => {
    render(<PlaceholderNode>Child</PlaceholderNode>);
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});