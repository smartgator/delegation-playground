'use client'

import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { RedemptionStep } from '@/types'

interface StepIndicatorProps {
  steps: RedemptionStep[]
  currentStepIndex: number
  onStepClick?: (index: number) => void
}

export function StepIndicator({ steps, currentStepIndex, onStepClick }: StepIndicatorProps) {
  return (
    <div className="relative">
      {steps.map((step, index) => {
        const isCompleted = step.status === 'completed'
        const isActive = step.status === 'active'
        const isPending = step.status === 'pending'
        const isLast = index === steps.length - 1
        
        return (
          <div key={step.id} className="relative">
            <div 
              className={cn(
                'flex items-start gap-4 p-3 rounded-xl transition-all duration-300 cursor-pointer',
                isActive && 'bg-primary/5 border border-primary/20',
                isCompleted && 'opacity-100',
                isPending && 'opacity-50'
              )}
              onClick={() => onStepClick?.(index)}
            >
              <div className="relative flex-shrink-0">
                <motion.div
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors duration-300',
                    isCompleted && 'bg-gradient-to-br from-primary to-accent border-transparent',
                    isActive && 'border-primary bg-primary/10',
                    isPending && 'border-border bg-muted/50'
                  )}
                  animate={isActive ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                  transition={isActive ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' } : {}}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <Check className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <span className={cn(
                      'text-sm font-bold',
                      isActive && 'text-primary',
                      isPending && 'text-muted-foreground'
                    )}>
                      {index + 1}
                    </span>
                  )}
                  
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                </motion.div>
                
                {!isLast && (
                  <div className="absolute left-1/2 top-12 -translate-x-1/2 w-0.5 h-8">
                    <div className={cn(
                      'w-full h-full transition-all duration-500',
                      isCompleted ? 'bg-gradient-to-b from-primary to-accent' : 'bg-border border-l-2 border-dashed border-border'
                    )} />
                    {isCompleted && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-primary to-accent"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3 }}
                        style={{ transformOrigin: 'top' }}
                      />
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0 pt-1.5">
                <h4 className={cn(
                  'text-sm font-semibold tracking-tight transition-colors duration-300',
                  isActive && 'text-primary',
                  isCompleted && 'text-foreground',
                  isPending && 'text-muted-foreground'
                )}>
                  {step.name}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {step.description}
                </p>
              </div>
            </div>
            
            {!isLast && <div className="h-4" />}
          </div>
        )
      })}
    </div>
  )
}
