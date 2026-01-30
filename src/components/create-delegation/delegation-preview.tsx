'use client'

import { useState } from 'react'
import { Check, Copy, FileJson } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { Delegation } from '@/types'

interface DelegationPreviewProps {
  delegation: Delegation | null
}

function syntaxHighlight(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'text-amber-400'
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-sky-400'
        } else {
          cls = 'text-emerald-400'
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-violet-400'
      } else if (/null/.test(match)) {
        cls = 'text-rose-400'
      }
      return `<span class="${cls}">${match}</span>`
    }
  )
}

function formatDelegationForDisplay(delegation: Delegation): object {
  return {
    delegate: delegation.delegate,
    delegator: delegation.delegator,
    authority: delegation.authority,
    caveats: delegation.caveats.map(c => ({
      enforcer: c.enforcer,
      terms: c.terms.length > 20 ? `${c.terms.slice(0, 20)}...` : c.terms,
      args: c.args,
    })),
    salt: delegation.salt.length > 20 ? `${delegation.salt.slice(0, 20)}...` : delegation.salt,
    signature: delegation.signature.length > 20 ? `${delegation.signature.slice(0, 20)}...` : delegation.signature,
  }
}

export function DelegationPreview({ delegation }: DelegationPreviewProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!delegation) return
    await navigator.clipboard.writeText(JSON.stringify(delegation, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const jsonString = delegation
    ? JSON.stringify(formatDelegationForDisplay(delegation), null, 2)
    : null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium text-foreground/80">
          <FileJson className="h-4 w-4 text-muted-foreground" />
          Delegation Object
        </Label>
        {delegation && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1.5 text-xs"
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
        )}
      </div>

      <div className="relative rounded-lg border border-border/50 bg-zinc-950 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        {delegation ? (
          <pre className="relative p-4 overflow-x-auto text-[13px] leading-relaxed font-mono">
            <code
              dangerouslySetInnerHTML={{
                __html: syntaxHighlight(jsonString!),
              }}
            />
          </pre>
        ) : (
          <div className="relative p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/30 mb-3">
              <FileJson className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No delegation configured yet
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Select delegator and delegate to preview
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
