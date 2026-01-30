'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { accounts } from '@/data/accounts'
import type { Account } from '@/types'

interface AccountSelectProps {
  value: Account | null
  onChange: (account: Account | null) => void
  label: string
  excludeId?: string
  placeholder?: string
}

export function AccountSelect({
  value,
  onChange,
  label,
  excludeId,
  placeholder = 'Select account...',
}: AccountSelectProps) {
  const availableAccounts = accounts.filter(a => a.id !== excludeId)

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-foreground/80">{label}</Label>
      <Select
        value={value?.id ?? ''}
        onValueChange={(id) => {
          const account = accounts.find(a => a.id === id)
          onChange(account ?? null)
        }}
      >
        <SelectTrigger className="w-full bg-background/50 border-border/50 hover:border-border transition-colors">
          <SelectValue placeholder={placeholder}>
            {value && (
              <div className="flex items-center gap-2">
                <div className={`h-5 w-5 rounded-full ${value.avatarColor} ring-2 ring-white/10`} />
                <span className="font-medium">{value.name}</span>
                <span className="text-xs text-muted-foreground font-mono">
                  {value.address.slice(0, 6)}...{value.address.slice(-4)}
                </span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-background/95 backdrop-blur-xl border-border/50">
          {availableAccounts.map((account) => (
            <SelectItem
              key={account.id}
              value={account.id}
              className="cursor-pointer focus:bg-accent/50"
            >
              <div className="flex items-center gap-3 py-1">
                <div className={`h-6 w-6 rounded-full ${account.avatarColor} ring-2 ring-white/10 shadow-lg`} />
                <div className="flex flex-col">
                  <span className="font-medium">{account.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {account.address.slice(0, 8)}...{account.address.slice(-6)}
                  </span>
                </div>
                <span className="ml-auto text-xs text-muted-foreground">
                  {account.balance}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
