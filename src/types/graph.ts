import type { Node, Edge } from '@xyflow/react';
import type { Address } from './common';
import type { Delegation, DecodedCaveat } from './delegation';

/** Account data for graph nodes */
export type AccountNodeData = {
  id: string;
  address: Address;
  name: string;
  avatarColor: string;
  balance?: string;
  isRoot?: boolean;
};

/** Custom account node type for React Flow */
export type AccountNode = Node<AccountNodeData, 'account'>;

/** Delegation edge data */
export type DelegationEdgeData = {
  delegationId: string;
  label: string;
  caveats: DecodedCaveat[];
  delegation: Delegation;
};

/** Custom delegation edge type for React Flow */
export type DelegationEdge = Edge<DelegationEdgeData, 'delegation'>;

/** Union type for all node types in the graph */
export type AppNode = AccountNode;

/** Union type for all edge types in the graph */
export type AppEdge = DelegationEdge;
