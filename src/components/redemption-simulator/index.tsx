'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { StepIndicator } from './step-indicator'
import { StepDetail } from './step-detail'
import { Button } from '@/components/ui/button'
import type { RedemptionStep } from '@/types'
import { Play, RotateCcw, Workflow, Sparkles } from 'lucide-react'

const REDEMPTION_STEPS: RedemptionStep[] = [
  { id: 'validate', name: 'Validate Input', description: 'Check delegations, modes, and executions match', status: 'pending' },
  { id: 'verify', name: 'Verify Signatures', description: 'Validate delegation signatures (ECDSA/ERC-1271)', status: 'pending' },
  { id: 'authority', name: 'Validate Authority', description: 'Verify delegation chain authority', status: 'pending' },
  { id: 'before-hook', name: 'Execute beforeHook', description: 'Run caveat enforcers before execution', status: 'pending' },
  { id: 'execute', name: 'Execute Action', description: 'Call executeFromExecutor on delegator', status: 'pending' },
  { id: 'after-hook', name: 'Execute afterHook', description: 'Run caveat enforcers after execution', status: 'pending' },
]

export function RedemptionSimulator() {
  const [steps, setSteps] = useState<RedemptionStep[]>(REDEMPTION_STEPS)
  const [isRunning, setIsRunning] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState(-1)
  const [completedOnce, setCompletedOnce] = useState(false)
  
  const runSimulation = useCallback(async () => {
    setIsRunning(true)
    setCurrentStepIndex(0)
    setCompletedOnce(false)
    
    setSteps(REDEMPTION_STEPS.map(s => ({ ...s, status: 'pending' })))
    
    for (let i = 0; i < REDEMPTION_STEPS.length; i++) {
      setCurrentStepIndex(i)
      setSteps(prev => prev.map((s, idx) => ({
        ...s,
        status: idx < i ? 'completed' : idx === i ? 'active' : 'pending'
      })))
      
      await new Promise(resolve => setTimeout(resolve, 1200))
    }
    
    setSteps(prev => prev.map(s => ({ ...s, status: 'completed' })))
    setCurrentStepIndex(REDEMPTION_STEPS.length)
    setIsRunning(false)
    setCompletedOnce(true)
  }, [])
  
  const resetSimulation = useCallback(() => {
    setSteps(REDEMPTION_STEPS.map(s => ({ ...s, status: 'pending' })))
    setCurrentStepIndex(-1)
    setIsRunning(false)
    setCompletedOnce(false)
  }, [])

  const allCompleted = steps.every(s => s.status === 'completed')

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
      <div className="p-6 border-b border-border/50">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <motion.div
              className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <Workflow className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Redemption Flow Simulator</h3>
              <p className="text-sm text-muted-foreground">
                Step through the delegation redemption process
              </p>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          Watch how the DelegationManager validates and executes a delegation redemption. 
          Each step shows the actual validation logic that happens on-chain.
        </p>
        
        <div className="flex items-center gap-3">
          <Button
            onClick={runSimulation}
            disabled={isRunning}
            className="gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Run Simulation'}
          </Button>
          <Button
            onClick={resetSimulation}
            variant="outline"
            disabled={isRunning || currentStepIndex === -1}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>
      
      <div className="grid lg:grid-cols-[280px_1fr] divide-y lg:divide-y-0 lg:divide-x divide-border/50">
        <div className="p-5 bg-muted/20">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Steps
          </h4>
          <StepIndicator 
            steps={steps} 
            currentStepIndex={currentStepIndex}
          />
        </div>
        
        <div className="p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Execution Details
          </h4>
          
          {currentStepIndex === -1 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
                <Play className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Click &quot;Run Simulation&quot; to step through the redemption flow
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {steps.map((step, index) => (
                <StepDetail
                  key={step.id}
                  step={step}
                  index={index}
                  isVisible={index <= currentStepIndex}
                />
              ))}
            </div>
          )}
          
          <AnimatePresence>
            {allCompleted && completedOnce && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 to-primary/10 border border-emerald-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      Redemption Complete!
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      All validation steps passed and execution succeeded
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
