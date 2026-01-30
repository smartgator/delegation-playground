'use client'

import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { cn } from '@/lib/utils'
import type { AccountNode as AccountNodeType } from '@/types'

export const AccountNode = memo(function AccountNode({
  data,
  selected,
}: NodeProps<AccountNodeType>) {
  const truncatedAddress = `${data.address.slice(0, 6)}...${data.address.slice(-4)}`

  return (
    <div
      className={cn(
        'group relative w-[160px] cursor-pointer',
        'rounded-xl border backdrop-blur-sm',
        'transition-all duration-300 ease-out',
        'hover:scale-[1.03] hover:shadow-xl hover:shadow-primary/10',
        data.isRoot
          ? 'border-amber-400/50 bg-gradient-to-br from-amber-50/95 to-orange-50/90 dark:from-amber-950/80 dark:to-orange-950/70'
          : 'border-border/60 bg-card/95',
        selected && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className={cn(
          '!h-3 !w-3 !border-2 !border-background',
          '!bg-primary/80 transition-colors',
          'group-hover:!bg-primary'
        )}
      />

      <div className="flex flex-col items-center gap-2.5 p-4">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            'text-lg font-bold text-white shadow-lg',
            'ring-2 ring-white/20',
            'transition-transform duration-300 group-hover:scale-110',
            data.avatarColor
          )}
        >
          {data.name.charAt(0).toUpperCase()}
        </div>

        <div className="flex flex-col items-center gap-0.5 text-center">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {data.name}
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            {truncatedAddress}
          </span>
        </div>

        {data.isRoot && (
          <div className="absolute -top-2 right-3">
            <span
              className={cn(
                'inline-flex items-center rounded-full px-2 py-0.5',
                'bg-amber-500 text-[9px] font-bold uppercase tracking-wider text-white',
                'shadow-md shadow-amber-500/30'
              )}
            >
              Root
            </span>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className={cn(
          '!h-3 !w-3 !border-2 !border-background',
          '!bg-accent transition-colors',
          'group-hover:!bg-accent/80'
        )}
      />
    </div>
  )
})
