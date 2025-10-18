import { describe, it, expect } from 'vitest';
import { nodeComponents } from '@/config/node-components';
import { NodeType } from '@/generated/prisma';

describe('nodeComponents registry', () => {
  it('maps INITIAL node type to a component', () => {
    expect(nodeComponents[NodeType.INITIAL]).toBeDefined();
  });
});