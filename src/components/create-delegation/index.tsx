'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AccountSelect } from './account-select'
import { CaveatBuilder } from './caveat-builder'
import { DelegationPreview } from './delegation-preview'
import { CodeSnippet } from './code-snippet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { generateRandomSalt, generateMockSignature } from '@/lib/delegation-utils'
import { getSmartAccountsEnvironment } from '@/lib/smart-accounts-config'
import type { Account, DecodedCaveat, Delegation, Caveat, Address, Hex } from '@/types'
import { ROOT_AUTHORITY } from '@/data/delegations'
import { Plus, RotateCcw, Sparkles, ArrowRight } from 'lucide-react'

// Get real Delegation Framework v1.3.0 enforcer addresses
const getEnforcerAddresses = (): Record<string, Address> => {
  const env = getSmartAccountsEnvironment();
  return {
    allowedTargets: env.addresses.enforcers.allowedTargets,
    nativeTokenTransferAmount: env.addresses.enforcers.nativeTokenTransferAmount,
    erc20TransferAmount: env.addresses.enforcers.erc20TransferAmount,
    timestamp: env.addresses.enforcers.timestamp,
  };
};

function encodeCaveat(decoded: DecodedCaveat): Caveat {
  const enforcerAddresses = getEnforcerAddresses();
  const enforcer = enforcerAddresses[decoded.type]
  return {
    enforcer,
    terms: '0x' as Hex,
    args: '0x' as Hex,
  }
}

interface CreateDelegationFormProps {
  onDelegationCreated?: (delegation: Delegation) => void
}

export function CreateDelegationForm({ onDelegationCreated }: CreateDelegationFormProps) {
  const [delegator, setDelegator] = useState<Account | null>(null)
  const [delegate, setDelegate] = useState<Account | null>(null)
  const [caveats, setCaveats] = useState<DecodedCaveat[]>([])
  const [isCreating, setIsCreating] = useState(false)

  const isValid = delegator && delegate && delegator.id !== delegate.id
  const validationError = useMemo(() => {
    if (!delegator) return null
    if (!delegate) return null
    if (delegator.id === delegate.id) return 'Delegator and delegate must be different accounts'
    return null
  }, [delegator, delegate])

  const previewDelegation = useMemo((): Delegation | null => {
    if (!delegator || !delegate) return null
    
    return {
      delegator: delegator.address,
      delegate: delegate.address,
      authority: ROOT_AUTHORITY,
      caveats: caveats.map(encodeCaveat),
      salt: '0x0000000000000000000000000000000000000000000000000000000000000000' as Hex,
      signature: '0x' as Hex,
    }
  }, [delegator, delegate, caveats])

  const handleCreateDelegation = async () => {
    if (!delegator || !delegate || !isValid) return

    setIsCreating(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))

    const delegation: Delegation = {
      delegator: delegator.address,
      delegate: delegate.address,
      authority: ROOT_AUTHORITY,
      caveats: caveats.map(encodeCaveat),
      salt: generateRandomSalt(),
      signature: generateMockSignature(),
    }

    setIsCreating(false)
    onDelegationCreated?.(delegation)
  }

  const handleReset = () => {
    setDelegator(null)
    setDelegate(null)
    setCaveats([])
  }

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03] pointer-events-none" />
      
      <CardHeader className="relative pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold">
              <Sparkles className="h-5 w-5 text-primary" />
              Create Delegation
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Grant permissions from one account to another with optional restrictions
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={handleReset}
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <AccountSelect
                label="From (Delegator)"
                value={delegator}
                onChange={setDelegator}
                excludeId={delegate?.id}
                placeholder="Who is granting..."
              />
              
              <div className="relative">
                <div className="hidden sm:flex lg:hidden xl:flex absolute -left-2 top-1/2 z-10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border/50">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <AccountSelect
                  label="To (Delegate)"
                  value={delegate}
                  onChange={setDelegate}
                  excludeId={delegator?.id}
                  placeholder="Who is receiving..."
                />
              </div>
            </div>

            {validationError && (
              <p className="text-sm text-destructive">{validationError}</p>
            )}

            <Separator className="bg-border/40" />

            <CaveatBuilder caveats={caveats} onChange={setCaveats} />

            <Separator className="bg-border/40" />

            <Button
              size="lg"
              className="w-full gap-2 font-medium"
              disabled={!isValid || isCreating}
              onClick={handleCreateDelegation}
            >
              {isCreating ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Delegation
                </>
              )}
            </Button>
          </div>

          <div className="space-y-6">
            <DelegationPreview delegation={previewDelegation} />
            <CodeSnippet delegator={delegator} delegate={delegate} caveats={caveats} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
