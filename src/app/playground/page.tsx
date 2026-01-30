'use client'

import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DelegationGraph } from '@/components/delegation-graph'
import { CreateDelegationForm } from '@/components/create-delegation'
import { CaveatExplorer } from '@/components/caveat-explorer'
import { sampleDelegations } from '@/data/delegations'
import type { Delegation } from '@/types'
import { GitBranch, PenTool, Shield, Play, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export default function PlaygroundPage() {
  const [delegations, setDelegations] = useState<Delegation[]>(sampleDelegations)
  const [activeTab, setActiveTab] = useState('create')
  const [mobileTab, setMobileTab] = useState('graph')

  const handleDelegationCreated = useCallback((newDelegation: Delegation) => {
    setDelegations(prev => [...prev, newDelegation])
  }, [])

  const [graphKey, setGraphKey] = useState(0)
  useEffect(() => {
    setGraphKey(prev => prev + 1)
  }, [delegations])

  const tabContentVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23888' fill-opacity='0.4'%3E%3Cpath d='M0 20L20 0L40 20L20 40z' fill='none' stroke='%23888' stroke-width='0.5'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Delegation Playground
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create, visualize, and explore delegation chains
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <div className="lg:hidden">
        <div className="container mx-auto px-4 py-4">
          <Tabs value={mobileTab} onValueChange={setMobileTab}>
            <TabsList className="w-full grid grid-cols-4 h-12 bg-muted/50 border border-border/50">
              <TabsTrigger value="graph" className="gap-1.5 data-[state=active]:bg-background">
                <GitBranch className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Graph</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="gap-1.5 data-[state=active]:bg-background">
                <PenTool className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Create</span>
              </TabsTrigger>
              <TabsTrigger value="caveats" className="gap-1.5 data-[state=active]:bg-background">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Caveats</span>
              </TabsTrigger>
              <TabsTrigger value="simulator" className="gap-1.5 data-[state=active]:bg-background">
                <Play className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Simulate</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mobileTab}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={tabContentVariants}
                  transition={{ duration: 0.2 }}
                >
                  <TabsContent value="graph" className="mt-0">
                    <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden min-h-[500px]">
                      <DelegationGraph 
                        key={graphKey}
                        delegations={delegations} 
                        className="h-[500px]"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="create" className="mt-0">
                    <CreateDelegationForm onDelegationCreated={handleDelegationCreated} />
                  </TabsContent>

                  <TabsContent value="caveats" className="mt-0">
                    <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6">
                      <CaveatExplorer />
                    </div>
                  </TabsContent>

                  <TabsContent value="simulator" className="mt-0">
                    <SimulatorPlaceholder />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative"
            >
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-lg">Delegation Graph</h2>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {delegations.length} delegation{delegations.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden shadow-lg shadow-primary/5">
                  <DelegationGraph 
                    key={graphKey}
                    delegations={delegations} 
                    className="min-h-[500px] h-[calc(100vh-220px)]"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full grid grid-cols-3 h-11 bg-muted/50 border border-border/50 mb-4">
                  <TabsTrigger 
                    value="create" 
                    className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <PenTool className="h-4 w-4" />
                    <span className="hidden xl:inline">Create</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="caveats" 
                    className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Shield className="h-4 w-4" />
                    <span className="hidden xl:inline">Caveats</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="simulator" 
                    className="gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    <Play className="h-4 w-4" />
                    <span className="hidden xl:inline">Simulate</span>
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={tabContentVariants}
                    transition={{ duration: 0.2 }}
                  >
                    <TabsContent value="create" className="mt-0">
                      <CreateDelegationForm onDelegationCreated={handleDelegationCreated} />
                    </TabsContent>

                    <TabsContent value="caveats" className="mt-0">
                      <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6">
                        <CaveatExplorer />
                      </div>
                    </TabsContent>

                    <TabsContent value="simulator" className="mt-0">
                      <SimulatorPlaceholder />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SimulatorPlaceholder() {
  return (
    <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
      <div className="p-8 md:p-12 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-6"
        >
          <Play className="h-8 w-8 text-primary" />
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">Redemption Simulator</h3>
        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
          Step through the validation flow and see how delegations are redeemed in real-time.
        </p>
        <Badge variant="outline" className="bg-primary/5 border-primary/20">
          Coming Soon
        </Badge>
      </div>
      
      <div className="relative h-32 bg-gradient-to-t from-muted/30 to-transparent">
        <div className="absolute inset-0 flex items-end justify-center gap-2 pb-4 opacity-40">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="w-8 rounded-t bg-primary/30"
              initial={{ height: 20 }}
              animate={{ height: [20, 40 + Math.random() * 30, 20] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
