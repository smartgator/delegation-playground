import type { CaveatMeta, DecodedCaveat, Address } from '@/types';

export const caveatMeta: CaveatMeta[] = [
  {
    type: 'allowedTargets',
    name: 'Allowed Targets',
    description: 'Restrict which contract addresses can be called',
    icon: 'Target',
    color: 'text-blue-500',
  },
  {
    type: 'nativeTokenTransferAmount',
    name: 'Native Token Limit',
    description: 'Cap the maximum ETH that can be spent',
    icon: 'Coins',
    color: 'text-yellow-500',
  },
  {
    type: 'erc20TransferAmount',
    name: 'ERC-20 Allowance',
    description: 'Limit the amount of specific tokens that can be transferred',
    icon: 'CircleDollarSign',
    color: 'text-green-500',
  },
  {
    type: 'timestamp',
    name: 'Time Window',
    description: 'Set a validity period for when the delegation can be used',
    icon: 'Clock',
    color: 'text-purple-500',
  },
];

export function getCaveatMeta(type: string): CaveatMeta | undefined {
  return caveatMeta.find(c => c.type === type);
}

// Sample decoded caveats for demo
export const sampleDecodedCaveats: Record<string, DecodedCaveat[]> = {
  'delegation-1': [
    {
      type: 'nativeTokenTransferAmount',
      maxAmount: BigInt('1000000000000000000'), // 1 ETH
      description: 'Max 1 ETH',
    },
    {
      type: 'allowedTargets',
      targets: ['0x6789012345678901234567890123456789012345' as Address],
      description: 'Only Uniswap Router',
    },
  ],
  'delegation-2': [
    {
      type: 'erc20TransferAmount',
      tokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as Address,
      tokenSymbol: 'USDC',
      maxAmount: BigInt('500000000'), // 500 USDC (6 decimals)
      description: 'Max 500 USDC',
    },
    {
      type: 'timestamp',
      afterThreshold: Math.floor(Date.now() / 1000),
      beforeThreshold: Math.floor(Date.now() / 1000) + 604800, // 7 days
      description: 'Valid for 7 days',
    },
  ],
};
