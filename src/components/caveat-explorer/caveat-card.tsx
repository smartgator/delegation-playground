'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Target, Coins, CircleDollarSign, Clock, ChevronDown } from 'lucide-react'
import type { CaveatMeta } from '@/types'
import { cn } from '@/lib/utils'
import { CaveatCode } from './caveat-code'

const iconMap = {
  Target,
  Coins,
  CircleDollarSign,
  Clock,
} as const

type IconName = keyof typeof iconMap

const caveatDetails: Record<string, {
  fullDescription: string
  example: string
  codeSnippet: string
  visualHint: string
}> = {
  allowedTargets: {
    fullDescription: 'Restricts which contract addresses the delegate can interact with. Only calls to whitelisted addresses will be allowed. This is essential for limiting delegate actions to specific protocols like Uniswap or Aave.',
    example: 'targets: ["0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D", "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2"]',
    codeSnippet: `import { createCaveat } from '@metamask/delegation-framework'

const allowedTargetsCaveat = createCaveat({
  type: 'allowedTargets',
  targets: [
    '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D', // Uniswap Router
    '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2', // Aave Pool
  ]
})`,
    visualHint: 'Whitelist',
  },
  nativeTokenTransferAmount: {
    fullDescription: 'Sets a maximum amount of ETH that can be transferred or spent. The caveat tracks cumulative spending across all transactions, providing a spending cap for the entire delegation period.',
    example: 'maxAmount: 1000000000000000000n // 1 ETH',
    codeSnippet: `import { createCaveat } from '@metamask/delegation-framework'
import { parseEther } from 'viem'

const nativeTokenLimitCaveat = createCaveat({
  type: 'nativeTokenTransferAmount',
  maxAmount: parseEther('1'), // 1 ETH maximum
})`,
    visualHint: 'Spending Cap',
  },
  erc20TransferAmount: {
    fullDescription: 'Limits how many tokens of a specific ERC-20 can be transferred. Each token requires its own caveat instance. The limit is cumulative across all transfers made by the delegate.',
    example: 'tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", maxAmount: 500000000n // 500 USDC',
    codeSnippet: `import { createCaveat } from '@metamask/delegation-framework'

const erc20AllowanceCaveat = createCaveat({
  type: 'erc20TransferAmount',
  tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  maxAmount: 500_000_000n, // 500 USDC (6 decimals)
})`,
    visualHint: 'Token Limit',
  },
  timestamp: {
    fullDescription: 'Defines a time window during which the delegation is valid. Outside this window, any redemption attempt will fail. Use afterThreshold for start time and beforeThreshold for expiration.',
    example: 'afterThreshold: 1706745600, beforeThreshold: 1707350400 // 7 days window',
    codeSnippet: `import { createCaveat } from '@metamask/delegation-framework'

const now = Math.floor(Date.now() / 1000)
const oneWeek = 7 * 24 * 60 * 60

const timestampCaveat = createCaveat({
  type: 'timestamp',
  afterThreshold: now,           // Valid from now
  beforeThreshold: now + oneWeek, // Expires in 7 days
})`,
    visualHint: 'Time Window',
  },
}

const colorBgMap: Record<string, string> = {
  'text-blue-500': 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/40',
  'text-yellow-500': 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40',
  'text-green-500': 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40',
  'text-purple-500': 'bg-violet-500/10 border-violet-500/20 hover:border-violet-500/40',
}

const colorAccentMap: Record<string, string> = {
  'text-blue-500': 'from-blue-500/20 to-blue-600/5',
  'text-yellow-500': 'from-amber-500/20 to-amber-600/5',
  'text-green-500': 'from-emerald-500/20 to-emerald-600/5',
  'text-purple-500': 'from-violet-500/20 to-violet-600/5',
}

interface CaveatCardProps {
  caveat: CaveatMeta
  index: number
  isExpanded: boolean
  onToggle: () => void
}

export function CaveatCard({ caveat, index, isExpanded, onToggle }: CaveatCardProps) {
  const Icon = iconMap[caveat.icon as IconName] || Target
  const details = caveatDetails[caveat.type]
  const bgColor = colorBgMap[caveat.color] || colorBgMap['text-blue-500']
  const accentGradient = colorAccentMap[caveat.color] || colorAccentMap['text-blue-500']

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15
          }
        }
      }}
      layout
      className={cn(
        'relative overflow-hidden rounded-xl border-2 transition-all duration-300 cursor-pointer',
        'backdrop-blur-sm',
        bgColor
      )}
      onClick={onToggle}
    >
      <div className={cn(
        'absolute inset-0 bg-gradient-to-br opacity-50 pointer-events-none',
        accentGradient
      )} />

      <div className="relative p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <motion.div 
              className={cn(
                'flex items-center justify-center w-12 h-12 rounded-lg',
                'bg-background/80 shadow-sm border border-border/50'
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className={cn('w-6 h-6', caveat.color)} strokeWidth={1.5} />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">{caveat.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{caveat.description}</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-shrink-0 mt-1"
          >
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ 
                opacity: 1, 
                height: 'auto',
                transition: {
                  height: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.25, delay: 0.15 }
                }
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                transition: {
                  height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
                  opacity: { duration: 0.2 }
                }
              }}
              className="overflow-hidden"
            >
              <div className="pt-5 space-y-5">
                <div className="h-px bg-border/60" />

                <div>
                  <h4 className="text-sm font-medium text-foreground/80 mb-2">How it works</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {details.fullDescription}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground/80 mb-2">Example Parameters</h4>
                  <div className="px-3 py-2 rounded-lg bg-muted/50 border border-border/50">
                    <code className="text-xs text-muted-foreground font-mono">
                      {details.example}
                    </code>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-foreground/80 mb-2">Code Example</h4>
                  <CaveatCode code={details.codeSnippet} />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <span className={cn(
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                    'bg-background/80 border border-border/50'
                  )}>
                    <Icon className={cn('w-3.5 h-3.5', caveat.color)} />
                    {details.visualHint}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        className={cn('h-1 w-full', caveat.color.replace('text-', 'bg-'))}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left' }}
      />
    </motion.div>
  )
}
