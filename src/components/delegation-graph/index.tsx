'use client'

import { useState, useCallback } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  applyNodeChanges,
  applyEdgeChanges,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeMouseHandler,
  type EdgeMouseHandler,
  BackgroundVariant,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { AccountNode } from './account-node'
import { DelegationEdge } from './delegation-edge'
import { DelegationDetailsPanel } from './delegation-details-panel'
import { useDelegationGraph } from './use-delegation-graph'
import type { AppNode, AppEdge, Delegation, AccountNodeData, DelegationEdgeData } from '@/types'
import { cn } from '@/lib/utils'

const nodeTypes = { account: AccountNode }
const edgeTypes = { delegation: DelegationEdge }

interface DelegationGraphProps {
  delegations: Delegation[]
  onNodeSelect?: (nodeId: string | null) => void
  onEdgeSelect?: (delegationId: string | null) => void
  className?: string
}

export function DelegationGraph({
  delegations,
  onNodeSelect,
  onEdgeSelect,
  className,
}: DelegationGraphProps) {
  const { nodes: initialNodes, edges: initialEdges } = useDelegationGraph(delegations)

  const [nodes, setNodes] = useState<AppNode[]>(initialNodes)
  const [edges, setEdges] = useState<AppEdge[]>(initialEdges)
  const [selectedNode, setSelectedNode] = useState<AccountNodeData | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<DelegationEdgeData | null>(null)

  const onNodesChange: OnNodesChange<AppNode> = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  )

  const onEdgesChange: OnEdgesChange<AppEdge> = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  )

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      setSelectedNode(node.data as AccountNodeData)
      setSelectedEdge(null)
      onNodeSelect?.(node.id)
    },
    [onNodeSelect]
  )

  const handleEdgeClick: EdgeMouseHandler = useCallback(
    (_event, edge) => {
      setSelectedEdge((edge.data as DelegationEdgeData) || null)
      setSelectedNode(null)
      onEdgeSelect?.(edge.id)
    },
    [onEdgeSelect]
  )

  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
    onNodeSelect?.(null)
    onEdgeSelect?.(null)
  }, [onNodeSelect, onEdgeSelect])

  const handleClosePanel = useCallback(() => {
    setSelectedNode(null)
    setSelectedEdge(null)
    onNodeSelect?.(null)
    onEdgeSelect?.(null)
  }, [onNodeSelect, onEdgeSelect])

  return (
    <div className={cn('relative h-full w-full', className)}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onEdgeClick={handleEdgeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        className="bg-background"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          className="!bg-background"
          color="oklch(0.5 0.02 250 / 0.3)"
        />
        <Controls
          className={cn(
            '[&>button]:border-border [&>button]:bg-card [&>button]:text-foreground',
            '[&>button:hover]:bg-muted'
          )}
          showInteractive={false}
        />
      </ReactFlow>

      <DelegationDetailsPanel
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onClose={handleClosePanel}
      />
    </div>
  )
}

export { useDelegationGraph } from './use-delegation-graph'
