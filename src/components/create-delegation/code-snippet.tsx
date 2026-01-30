'use client'

import { useState } from 'react'
import { Check, Copy, Code2, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { Button } from '@/components/ui/button'
import type { Account, DecodedCaveat } from '@/types'

interface CodeSnippetProps {
  delegator: Account | null
  delegate: Account | null
  caveats: DecodedCaveat[]
}

function formatCaveatCode(caveat: DecodedCaveat): string {
  switch (caveat.type) {
    case 'allowedTargets':
      return `    { type: "allowedTargets", targets: [${caveat.targets.map(t => `"${t}"`).join(', ')}] }`
    case 'nativeTokenTransferAmount':
      return `    { type: "nativeTokenTransferAmount", maxAmount: ${caveat.maxAmount.toString()}n }`
    case 'erc20TransferAmount':
      return `    { type: "erc20TransferAmount", token: "${caveat.tokenSymbol}", maxAmount: ${caveat.maxAmount.toString()}n }`
    case 'timestamp':
      const parts = []
      if (caveat.afterThreshold) parts.push(`afterThreshold: ${caveat.afterThreshold}`)
      if (caveat.beforeThreshold) parts.push(`beforeThreshold: ${caveat.beforeThreshold}`)
      return `    { type: "timestamp", ${parts.join(', ')} }`
    default:
      return '    { type: "unknown" }'
  }
}

function generateCode(
  delegator: Account | null,
  delegate: Account | null,
  caveats: DecodedCaveat[]
): string {
  const delegatorAddress = delegator?.address ?? '<delegator_address>'
  const delegateAddress = delegate?.address ?? '<delegate_address>'

  const caveatLines = caveats.length > 0
    ? caveats.map(formatCaveatCode).join(',\n')
    : '    // Add caveats to define restrictions'

  return `import { createDelegation } from "@metamask/delegation-framework";

const delegation = createDelegation({
  delegate: "${delegateAddress}",
  delegator: "${delegatorAddress}",
  caveats: [
${caveatLines}
  ],
});

// Sign and submit the delegation
const signedDelegation = await signer.signDelegation(delegation);`
}

function syntaxHighlight(code: string): string {
  return code
    .replace(/(import|from|const|await)/g, '<span class="text-violet-400">$1</span>')
    .replace(/(".*?")/g, '<span class="text-emerald-400">$1</span>')
    .replace(/(\d+n?)/g, '<span class="text-amber-400">$1</span>')
    .replace(/(\/\/.*)/g, '<span class="text-zinc-500">$1</span>')
    .replace(/(createDelegation|signDelegation)/g, '<span class="text-sky-400">$1</span>')
    .replace(/(delegate|delegator|caveats|type|targets|maxAmount|token|afterThreshold|beforeThreshold):/g, '<span class="text-rose-400">$1</span>:')
}

export function CodeSnippet({ delegator, delegate, caveats }: CodeSnippetProps) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(true)

  const code = generateCode(delegator, delegate, caveats)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full group"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <Code2 className="h-4 w-4 text-muted-foreground" />
          SDK Code
        </span>
        <span className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          {expanded ? 'Collapse' : 'Expand'}
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="relative rounded-lg border border-border/50 bg-zinc-950 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-sky-500/5 pointer-events-none" />
              
              <div className="relative flex items-center justify-between px-4 py-2 border-b border-border/30 bg-zinc-900/50">
                <span className="text-xs text-muted-foreground font-mono">
                  delegation.ts
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 gap-1.5 text-xs px-2"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>

              <pre className="relative p-4 overflow-x-auto text-[13px] leading-relaxed font-mono">
                <code
                  dangerouslySetInnerHTML={{
                    __html: syntaxHighlight(code),
                  }}
                />
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
