import { useMemo } from 'react'
import type { Delegation, AppNode, AppEdge, Address } from '@/types'
import { getAccountByAddress } from '@/data/accounts'
import { getDecodedCaveats, getDelegationId, ROOT_AUTHORITY } from '@/data/delegations'

interface NodePosition {
  x: number
  y: number
  level: number
  isRoot: boolean
}

function calculateNodePositions(delegations: Delegation[]): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>()
  const addressLevels = new Map<string, number>()
  const rootDelegators = new Set<string>()
  const allDelegates = new Set<string>()

  delegations.forEach(d => {
    const delegatorLower = d.delegator.toLowerCase()
    const delegateLower = d.delegate.toLowerCase()

    if (d.authority === ROOT_AUTHORITY) {
      rootDelegators.add(delegatorLower)
    }
    allDelegates.add(delegateLower)
  })

  delegations.forEach(d => {
    const delegatorLower = d.delegator.toLowerCase()
    if (!allDelegates.has(delegatorLower)) {
      rootDelegators.add(delegatorLower)
    }
  })

  const queue: Array<{ address: string; level: number }> = []
  rootDelegators.forEach(addr => {
    queue.push({ address: addr, level: 0 })
    addressLevels.set(addr, 0)
  })

  while (queue.length > 0) {
    const { address, level } = queue.shift()!

    delegations.forEach(d => {
      const delegatorLower = d.delegator.toLowerCase()
      const delegateLower = d.delegate.toLowerCase()

      if (delegatorLower === address) {
        const existingLevel = addressLevels.get(delegateLower)
        const newLevel = level + 1

        if (existingLevel === undefined || newLevel < existingLevel) {
          addressLevels.set(delegateLower, newLevel)
          queue.push({ address: delegateLower, level: newLevel })
        }
      }
    })
  }

  const levelGroups = new Map<number, string[]>()
  addressLevels.forEach((level, address) => {
    const group = levelGroups.get(level) || []
    group.push(address)
    levelGroups.set(level, group)
  })

  const nodeWidth = 180
  const levelHeight = 160
  const startY = 50

  levelGroups.forEach((addresses, level) => {
    const totalWidth = addresses.length * nodeWidth
    const startX = 250 - totalWidth / 2 + nodeWidth / 2

    addresses.forEach((address, index) => {
      positions.set(address, {
        x: startX + index * nodeWidth,
        y: startY + level * levelHeight,
        level,
        isRoot: rootDelegators.has(address),
      })
    })
  })

  return positions
}

export function useDelegationGraph(delegations: Delegation[]) {
  return useMemo(() => {
    const nodes: AppNode[] = []
    const edges: AppEdge[] = []
    const accountSet = new Set<string>()

    delegations.forEach(d => {
      accountSet.add(d.delegator.toLowerCase())
      accountSet.add(d.delegate.toLowerCase())
    })

    const positions = calculateNodePositions(delegations)

    accountSet.forEach(addressLower => {
      const account = getAccountByAddress(addressLower)
      const position = positions.get(addressLower) || { x: 250, y: 100, level: 0, isRoot: false }

      nodes.push({
        id: addressLower,
        type: 'account',
        position: { x: position.x, y: position.y },
        data: {
          id: account?.id || addressLower.slice(0, 8),
          address: (account?.address || addressLower) as Address,
          name: account?.name || `${addressLower.slice(0, 6)}...${addressLower.slice(-4)}`,
          avatarColor: account?.avatarColor || 'bg-gray-500',
          balance: account?.balance,
          isRoot: position.isRoot,
        },
      })
    })

    delegations.forEach(d => {
      const delegationId = getDelegationId(d)
      const decodedCaveats = getDecodedCaveats(delegationId)

      edges.push({
        id: delegationId,
        source: d.delegator.toLowerCase(),
        target: d.delegate.toLowerCase(),
        type: 'delegation',
        animated: true,
        data: {
          delegationId,
          label: decodedCaveats.length === 1
            ? '1 caveat'
            : `${decodedCaveats.length} caveats`,
          caveats: decodedCaveats,
          delegation: d,
        },
      })
    })

    return { nodes, edges }
  }, [delegations])
}
