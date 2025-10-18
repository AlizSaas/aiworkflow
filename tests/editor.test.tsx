import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock workflow hook
vi.mock('@/components/features/workflows/hooks/use-workflows', () => ({
  useSuspenseWorkflow: (id: string) => ({
    data: {
      id,
      name: 'WF',
      nodes: [{ id: 'n1', type: 'INITIAL', position: { x: 0, y: 0 }, data: {} }],
      edges: [],
    },
  }),
}));

// Mock @xyflow/react (ReactFlow + primitives)
vi.mock('@xyflow/react', async () => {
  const React = await import('react');
  type Props = any;
  const ReactFlow = ({ nodes, edges, onConnect, children }: Props) => {
    return React.createElement(
      'div',
      {
        'data-testid': 'reactflow',
        onClick: () => onConnect && onConnect({ source: 'n1', target: 'n2' }),
      },
      React.createElement('div', { 'data-testid': 'edges-count' }, String(edges?.length ?? 0)),
      children,
    );
  };
  const dummy = () => null;
  return {
    ReactFlow,
    Background: dummy,
    Controls: dummy,
    MiniMap: dummy,
    Panel: ({ children }: any) => React.createElement('div', { 'data-testid': 'panel' }, children),
    addEdge: (conn: any, es: any[]) => [...es, { id: `${conn.source}-${conn.target}`, source: conn.source, target: conn.target }],
    applyNodeChanges: (_: any, nodes: any[]) => nodes,
    applyEdgeChanges: (_: any, edges: any[]) => edges,
    Handle: dummy,
    NodeToolbar: ({ children }: any) => React.createElement('div', null, children),
    Position: { Top: 'top', Bottom: 'bottom' },
  };
});

import { Editor } from '@/components/features/editor/components/editor';

describe('Editor', () => {
  it('renders ReactFlow with nodes/edges and AddNodeButton panel', () => {
    render(<Editor workflowId="w1" />);
    expect(screen.getByTestId('reactflow')).toBeInTheDocument();
    expect(screen.getByTestId('panel')).toBeInTheDocument();
    expect(screen.getByTestId('edges-count').textContent).toBe('0');
  });

  it('onConnect adds an edge (via mocked addEdge) and re-renders', () => {
    render(<Editor workflowId="w1" />);
    const rf = screen.getByTestId('reactflow');
    fireEvent.click(rf); // triggers onConnect({source:n1,target:n2})
    expect(screen.getByTestId('edges-count').textContent).toBe('1');
  });
});