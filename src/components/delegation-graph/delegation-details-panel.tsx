'use client'

import { X, Shield, Clock, Target, Coins } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'
import type { AccountNodeData, DelegationEdgeData, DecodedCaveat } from '@/types'
import { getAccountByAddress } from '@/data/accounts'
import { getDelegationsByDelegator, getDelegationsByDelegate, ROOT_AUTHORITY } from '@/data/delegations'

interface DelegationDetailsPanelProps {
  selectedNode: AccountNodeData | null
  selectedEdge: DelegationEdgeData | null
  onClose: () => void
}

function CaveatIcon({ type }: { type: DecodedCaveat['type'] }) {
  const iconClass = 'h-4 w-4'
  switch (type) {
    case 'allowedTargets':
      return <Target className={cn(iconClass, 'text-blue-500')} />
    case 'nativeTokenTransferAmount':
      return <Coins className={cn(iconClass, 'text-yellow-500')} />
    case 'erc20TransferAmount':
      return <Coins className={cn(iconClass, 'text-green-500')} />
    case 'timestamp':
      return <Clock className={cn(iconClass, 'text-purple-500')} />
    default:
      return <Shield className={cn(iconClass, 'text-muted-foreground')} />
  }
}

function CaveatDisplay({ caveat }: { caveat: DecodedCaveat }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-start gap-3 rounded-lg border border-border/50 bg-muted/30 p-3"
    >
      <div className="mt-0.5">
        <CaveatIcon type={caveat.type} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-medium capitalize text-foreground">
          {caveat.type.replace(/([A-Z])/g, ' $1').trim()}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {caveat.description}
        </div>
      </div>
    </motion.div>
  )
}

function AccountDetails({ data }: { data: AccountNodeData }) {
  const account = getAccountByAddress(data.address)
  const delegationsFrom = getDelegationsByDelegator(data.address)
  const delegationsTo = getDelegationsByDelegate(data.address)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full',
            'text-lg font-bold text-white shadow-lg',
            data.avatarColor
          )}
        >
          {data.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="font-semibold text-foreground">{data.name}</div>
          {data.isRoot && (
            <span className="inline-flex items-center rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Root Delegator
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Address
        </div>
        <code className="block break-all rounded-md bg-muted/50 px-3 py-2 font-mono text-xs text-foreground">
          {data.address}
        </code>
      </div>

      {account?.balance && (
        <div className="space-y-1">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Balance
          </div>
          <div className="text-lg font-semibold text-foreground">{account.balance}</div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
          <div className="text-2xl font-bold text-primary">{delegationsFrom.length}</div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Delegating
          </div>
        </div>
        <div className="rounded-lg border border-border/50 bg-muted/30 p-3 text-center">
          <div className="text-2xl font-bold text-accent">{delegationsTo.length}</div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Received
          </div>
        </div>
      </div>
    </div>
  )
}

function DelegationDetails({ data }: { data: DelegationEdgeData }) {
  const delegator = getAccountByAddress(data.delegation.delegator)
  const delegate = getAccountByAddress(data.delegation.delegate)
  const isRoot = data.delegation.authority === ROOT_AUTHORITY

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <span className="font-semibold text-foreground">Delegation</span>
        {isRoot && (
          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
            Root
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white',
            delegator?.avatarColor || 'bg-gray-500'
          )}
        >
          {(delegator?.name || 'U').charAt(0)}
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">From</div>
          <div className="text-sm font-medium text-foreground">
            {delegator?.name || `${data.delegation.delegator.slice(0, 8)}...`}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20">
          <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/30 p-3">
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white',
            delegate?.avatarColor || 'bg-gray-500'
          )}
        >
          {(delegate?.name || 'U').charAt(0)}
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground">To</div>
          <div className="text-sm font-medium text-foreground">
            {delegate?.name || `${data.delegation.delegate.slice(0, 8)}...`}
          </div>
        </div>
      </div>

      {data.caveats.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Caveats ({data.caveats.length})
          </div>
          <div className="space-y-2">
            {data.caveats.map((caveat, index) => (
              <CaveatDisplay key={index} caveat={caveat} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2 pt-2">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Signature
        </div>
        <code className="block break-all rounded-md bg-muted/50 px-3 py-2 font-mono text-[10px] text-muted-foreground">
          {data.delegation.signature.slice(0, 42)}...
        </code>
      </div>
    </div>
  )
}

export function DelegationDetailsPanel({
  selectedNode,
  selectedEdge,
  onClose,
}: DelegationDetailsPanelProps) {
  const isOpen = selectedNode !== null || selectedEdge !== null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'absolute right-4 top-4 bottom-4 w-80 z-10',
            'rounded-xl border border-border/50 bg-card/95 backdrop-blur-md shadow-2xl',
            'overflow-hidden'
          )}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-border/50 px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">
                {selectedNode ? 'Account' : 'Delegation'}
              </h3>
              <button
                onClick={onClose}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-md',
                  'text-muted-foreground transition-colors',
                  'hover:bg-muted hover:text-foreground'
                )}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {selectedNode && <AccountDetails data={selectedNode} />}
              {selectedEdge && <DelegationDetails data={selectedEdge} />}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
