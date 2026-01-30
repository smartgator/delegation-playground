'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { CaveatCard } from './caveat-card'
import { caveatMeta } from '@/data/caveats'

export function CaveatExplorer() {
  const [expandedType, setExpandedType] = useState<string | null>(null)

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
          Caveat Types
        </h2>
        <p className="mt-2 text-muted-foreground text-lg">
          Caveats are restrictions that control how delegated permissions can be used.
        </p>
      </motion.div>
      
      <motion.div 
        className="grid gap-5 md:grid-cols-2"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.2
            }
          }
        }}
      >
        {caveatMeta.map((caveat, index) => (
          <CaveatCard
            key={caveat.type}
            caveat={caveat}
            index={index}
            isExpanded={expandedType === caveat.type}
            onToggle={() => setExpandedType(
              expandedType === caveat.type ? null : caveat.type
            )}
          />
        ))}
      </motion.div>
    </div>
  )
}
