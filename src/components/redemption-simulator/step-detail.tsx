'use client'

import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle2, Loader2, Circle, FileCheck, ShieldCheck, Link2, Zap, ArrowRight, Terminal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RedemptionStep } from '@/types'

interface StepDetailProps {
  step: RedemptionStep
  isVisible: boolean
  index: number
}

const stepDetails: Record<string, { 
  icon: React.ElementType
  color: string
  details: string[]
}> = {
  validate: {
    icon: FileCheck,
    color: 'text-blue-500',
    details: [
      'Checking 2 delegations, 1 execution batch...',
      'Delegation array length matches modes array',
      'Execution batch has valid calldata',
    ],
  },
  verify: {
    icon: ShieldCheck,
    color: 'text-amber-500',
    details: [
      'Verifying ECDSA signature from 0x1234...5678',
      'Signature hash: 0xabcd...ef01',
      'Recovery successful, signer verified',
    ],
  },
  authority: {
    icon: Link2,
    color: 'text-emerald-500',
    details: [
      'Chain depth: 2, Root authority verified',
      'Delegator: 0xABCD...1234 (root)',
      'Delegate: 0x5678...EFGH (authorized)',
    ],
  },
  'before-hook': {
    icon: Zap,
    color: 'text-violet-500',
    details: [
      'Running NativeTokenLimitEnforcer...',
      'Current spent: 0.3 ETH / 1.0 ETH limit',
      'Result: Within limit',
    ],
  },
  execute: {
    icon: ArrowRight,
    color: 'text-primary',
    details: [
      'Calling executeFromExecutor on delegator',
      'Target: 0x7a25...F2488D (Uniswap)',
      'Value: 0.5 ETH transfer',
    ],
  },
  'after-hook': {
    icon: Terminal,
    color: 'text-pink-500',
    details: [
      'Running NativeTokenLimitEnforcer...',
      'Updating spent: 0.8 ETH / 1.0 ETH',
      'State updated successfully',
    ],
  },
}

export function StepDetail({ step, isVisible, index }: StepDetailProps) {
  const config = stepDetails[step.id] || stepDetails.validate
  const Icon = config.icon
  const isCompleted = step.status === 'completed'
  const isActive = step.status === 'active'
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.05,
            ease: [0.22, 1, 0.36, 1]
          }}
          className={cn(
            'relative overflow-hidden rounded-xl border-2 transition-all duration-300',
            isActive && 'border-primary/40 bg-primary/5',
            isCompleted && 'border-emerald-500/30 bg-emerald-500/5',
            !isActive && !isCompleted && 'border-border/50 bg-card/30'
          )}
        >
          <div className={cn(
            'absolute inset-0 opacity-20 pointer-events-none',
            isActive && 'bg-gradient-to-br from-primary/30 to-transparent',
            isCompleted && 'bg-gradient-to-br from-emerald-500/30 to-transparent'
          )} />
          
          <div className="relative p-4">
            <div className="flex items-start gap-3 mb-3">
              <div className={cn(
                'flex items-center justify-center w-9 h-9 rounded-lg',
                'bg-background/80 border border-border/50'
              )}>
                <Icon className={cn('w-4.5 h-4.5', config.color)} strokeWidth={1.5} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold tracking-tight">{step.name}</h4>
                  {isActive && (
                    <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
                  )}
                  {isCompleted && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
            
            <div className="space-y-1.5 pl-12">
              {config.details.map((detail, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex items-center gap-2 text-xs"
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                  ) : isActive ? (
                    <Circle className="w-3 h-3 text-primary fill-primary/20 flex-shrink-0" />
                  ) : (
                    <Circle className="w-3 h-3 text-muted-foreground/50 flex-shrink-0" />
                  )}
                  <span className={cn(
                    'font-mono',
                    isCompleted && 'text-muted-foreground',
                    isActive && 'text-foreground',
                    !isActive && !isCompleted && 'text-muted-foreground/70'
                  )}>
                    {detail}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div
            className={cn(
              'h-0.5 w-full',
              isCompleted ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-primary to-accent'
            )}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: isCompleted || isActive ? 1 : 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: 'left' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
