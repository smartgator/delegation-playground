'use client'

import { memo } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from '@xyflow/react'
import { cn } from '@/lib/utils'
import type { DelegationEdge as DelegationEdgeType } from '@/types'
import { ROOT_AUTHORITY } from '@/data/delegations'

export const DelegationEdge = memo(function DelegationEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<DelegationEdgeType>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.25,
  })

  const isRedelegation = data?.delegation.authority !== ROOT_AUTHORITY

  return (
    <>
      <defs>
        <linearGradient
          id={`edge-gradient-${id}`}
          gradientUnits="userSpaceOnUse"
          x1={sourceX}
          y1={sourceY}
          x2={targetX}
          y2={targetY}
        >
          <stop
            offset="0%"
            stopColor={isRedelegation ? 'oklch(0.6 0.2 260)' : 'oklch(0.7 0.15 195)'}
          />
          <stop
            offset="100%"
            stopColor={isRedelegation ? 'oklch(0.5 0.18 280)' : 'oklch(0.6 0.12 210)'}
          />
        </linearGradient>
      </defs>

      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: `url(#edge-gradient-${id})`,
          strokeWidth: selected ? 3 : 2,
          strokeDasharray: '8 4',
          filter: selected ? 'drop-shadow(0 0 6px oklch(0.7 0.15 195 / 0.5))' : undefined,
        }}
        className="transition-all duration-200"
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
        >
          <button
            className={cn(
              'rounded-full px-2.5 py-1 text-[10px] font-medium',
              'border backdrop-blur-sm transition-all duration-200',
              'hover:scale-105',
              isRedelegation
                ? 'border-accent/40 bg-accent/20 text-accent-foreground'
                : 'border-primary/40 bg-primary/20 text-primary-foreground dark:text-primary',
              selected && 'ring-2 ring-primary ring-offset-1 ring-offset-background'
            )}
          >
            {data?.label || 'Delegation'}
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  )
})
