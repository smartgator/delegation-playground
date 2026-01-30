'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Plus, X, Target, Coins, CircleDollarSign, Clock, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { caveatMeta } from '@/data/caveats'
import type { DecodedCaveat, CaveatType, Address } from '@/types'

const MOCK_TOKENS = [
  { symbol: 'USDC', address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6 },
  { symbol: 'USDT', address: '0xdac17f958d2ee523a2206206994597c13d831ec7', decimals: 6 },
  { symbol: 'DAI', address: '0x6b175474e89094c44da98b954eedeac495271d0f', decimals: 18 },
] as const

const CAVEAT_ICONS = {
  allowedTargets: Target,
  nativeTokenTransferAmount: Coins,
  erc20TransferAmount: CircleDollarSign,
  timestamp: Clock,
} as const

interface CaveatBuilderProps {
  caveats: DecodedCaveat[]
  onChange: (caveats: DecodedCaveat[]) => void
}

interface CaveatFormState {
  type: CaveatType | null
  targets: string
  ethAmount: string
  tokenSymbol: string
  tokenAmount: string
  startDate: string
  endDate: string
}

const initialFormState: CaveatFormState = {
  type: null,
  targets: '',
  ethAmount: '',
  tokenSymbol: 'USDC',
  tokenAmount: '',
  startDate: '',
  endDate: '',
}

export function CaveatBuilder({ caveats, onChange }: CaveatBuilderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState<CaveatFormState>(initialFormState)
  const [step, setStep] = useState<'select' | 'configure'>('select')

  const resetForm = () => {
    setForm(initialFormState)
    setStep('select')
  }

  const handleRemoveCaveat = (index: number) => {
    onChange(caveats.filter((_, i) => i !== index))
  }

  const handleAddCaveat = () => {
    if (!form.type) return

    let newCaveat: DecodedCaveat | null = null

    switch (form.type) {
      case 'allowedTargets': {
        const targets = form.targets
          .split(',')
          .map(t => t.trim())
          .filter(t => t.startsWith('0x') && t.length === 42) as Address[]
        if (targets.length === 0) return
        newCaveat = {
          type: 'allowedTargets',
          targets,
          description: `${targets.length} allowed target${targets.length !== 1 ? 's' : ''}`,
        }
        break
      }
      case 'nativeTokenTransferAmount': {
        const eth = parseFloat(form.ethAmount)
        if (isNaN(eth) || eth <= 0) return
        const wei = BigInt(Math.floor(eth * 1e18))
        newCaveat = {
          type: 'nativeTokenTransferAmount',
          maxAmount: wei,
          description: `Max ${eth} ETH`,
        }
        break
      }
      case 'erc20TransferAmount': {
        const token = MOCK_TOKENS.find(t => t.symbol === form.tokenSymbol)
        if (!token) return
        const amount = parseFloat(form.tokenAmount)
        if (isNaN(amount) || amount <= 0) return
        const rawAmount = BigInt(Math.floor(amount * Math.pow(10, token.decimals)))
        newCaveat = {
          type: 'erc20TransferAmount',
          tokenAddress: token.address as Address,
          tokenSymbol: token.symbol,
          maxAmount: rawAmount,
          description: `Max ${amount.toLocaleString()} ${token.symbol}`,
        }
        break
      }
      case 'timestamp': {
        const start = form.startDate ? new Date(form.startDate).getTime() / 1000 : undefined
        const end = form.endDate ? new Date(form.endDate).getTime() / 1000 : undefined
        if (!start && !end) return
        let description = 'Time restricted'
        if (start && end) {
          const days = Math.round((end - start) / 86400)
          description = `Valid for ${days} day${days !== 1 ? 's' : ''}`
        } else if (start) {
          description = `Valid after ${new Date(start * 1000).toLocaleDateString()}`
        } else if (end) {
          description = `Valid until ${new Date(end * 1000).toLocaleDateString()}`
        }
        newCaveat = {
          type: 'timestamp',
          afterThreshold: start,
          beforeThreshold: end,
          description,
        }
        break
      }
    }

    if (newCaveat) {
      onChange([...caveats, newCaveat])
      setIsOpen(false)
      resetForm()
    }
  }

  const selectCaveatType = (type: CaveatType) => {
    setForm({ ...form, type })
    setStep('configure')
  }

  const getCaveatColor = (type: CaveatType) => {
    const meta = caveatMeta.find(c => c.type === type)
    return meta?.color ?? 'text-gray-500'
  }

  const getCaveatName = (type: CaveatType) => {
    const meta = caveatMeta.find(c => c.type === type)
    return meta?.name ?? type
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium text-foreground/80">Caveats</Label>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 border-dashed border-border/60 hover:border-primary/50 hover:bg-primary/5">
              <Plus className="h-3.5 w-3.5" />
              Add Caveat
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-xl border-border/50">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                {step === 'select' ? 'Choose Caveat Type' : getCaveatName(form.type!)}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {step === 'select'
                  ? 'Select the type of restriction to add'
                  : 'Configure the caveat parameters'}
              </DialogDescription>
            </DialogHeader>

            {step === 'select' ? (
              <div className="grid grid-cols-2 gap-3 py-4">
                {caveatMeta.map((meta) => {
                  const Icon = CAVEAT_ICONS[meta.type]
                  return (
                    <button
                      key={meta.type}
                      onClick={() => selectCaveatType(meta.type)}
                      className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className={`p-2.5 rounded-lg bg-background ${meta.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{meta.name}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="py-4 space-y-4">
                {form.type === 'allowedTargets' && (
                  <div className="space-y-2">
                    <Label htmlFor="targets">Target Addresses</Label>
                    <Input
                      id="targets"
                      placeholder="0x1234..., 0x5678..."
                      value={form.targets}
                      onChange={(e) => setForm({ ...form, targets: e.target.value })}
                      className="font-mono text-sm"
                    />
                    <p className="text-xs text-muted-foreground">
                      Comma-separated list of contract addresses
                    </p>
                  </div>
                )}

                {form.type === 'nativeTokenTransferAmount' && (
                  <div className="space-y-2">
                    <Label htmlFor="ethAmount">Maximum ETH Amount</Label>
                    <div className="relative">
                      <Input
                        id="ethAmount"
                        type="number"
                        step="0.001"
                        min="0"
                        placeholder="1.0"
                        value={form.ethAmount}
                        onChange={(e) => setForm({ ...form, ethAmount: e.target.value })}
                        className="pr-12"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                        ETH
                      </span>
                    </div>
                  </div>
                )}

                {form.type === 'erc20TransferAmount' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="token">Token</Label>
                      <Select
                        value={form.tokenSymbol}
                        onValueChange={(v) => setForm({ ...form, tokenSymbol: v })}
                      >
                        <SelectTrigger id="token">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MOCK_TOKENS.map((token) => (
                            <SelectItem key={token.symbol} value={token.symbol}>
                              {token.symbol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tokenAmount">Maximum Amount</Label>
                      <div className="relative">
                        <Input
                          id="tokenAmount"
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="500"
                          value={form.tokenAmount}
                          onChange={(e) => setForm({ ...form, tokenAmount: e.target.value })}
                          className="pr-16"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                          {form.tokenSymbol}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {form.type === 'timestamp' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Valid From</Label>
                      <Input
                        id="startDate"
                        type="datetime-local"
                        value={form.startDate}
                        onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Valid Until</Label>
                      <Input
                        id="endDate"
                        type="datetime-local"
                        value={form.endDate}
                        onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="gap-2">
              {step === 'configure' && (
                <Button variant="ghost" onClick={() => setStep('select')}>
                  Back
                </Button>
              )}
              {step === 'configure' && (
                <Button onClick={handleAddCaveat}>
                  Add Caveat
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {caveats.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-dashed border-border/40 bg-muted/20 p-6 text-center"
            >
              <p className="text-sm text-muted-foreground">
                No caveats added yet. Add restrictions to control what the delegate can do.
              </p>
            </motion.div>
          ) : (
            caveats.map((caveat, index) => {
              const Icon = CAVEAT_ICONS[caveat.type]
              const color = getCaveatColor(caveat.type)
              return (
                <motion.div
                  key={`${caveat.type}-${index}`}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -20, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/50 bg-background/50 px-4 py-3 group hover:border-border transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md bg-muted/50 ${color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{getCaveatName(caveat.type)}</p>
                      <p className="text-xs text-muted-foreground">{caveat.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemoveCaveat(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
