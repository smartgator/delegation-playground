import type { Address, DecodedCaveat, Hex } from '@/types';

export function formatAddress(address: Address | Hex): string {
  if (!address || address.length < 10) return address || '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function formatEthAmount(amount: bigint): string {
  const eth = Number(amount) / 1e18;
  if (eth >= 1) {
    return `${eth.toFixed(2)} ETH`;
  }
  return `${(eth * 1000).toFixed(2)} mETH`;
}

export function formatTokenAmount(amount: bigint, decimals: number, symbol: string): string {
  const value = Number(amount) / Math.pow(10, decimals);
  return `${value.toLocaleString()} ${symbol}`;
}

export function getCaveatLabel(caveat: DecodedCaveat): string {
  switch (caveat.type) {
    case 'allowedTargets':
      return `${caveat.targets.length} allowed target${caveat.targets.length !== 1 ? 's' : ''}`;
    case 'nativeTokenTransferAmount':
      return formatEthAmount(caveat.maxAmount);
    case 'erc20TransferAmount':
      return formatTokenAmount(caveat.maxAmount, 6, caveat.tokenSymbol);
    case 'timestamp':
      if (caveat.afterThreshold && caveat.beforeThreshold) {
        const days = Math.round((caveat.beforeThreshold - caveat.afterThreshold) / 86400);
        return `Valid for ${days} day${days !== 1 ? 's' : ''}`;
      }
      return 'Time restricted';
    default:
      return 'Unknown caveat';
  }
}

export function getCaveatDescription(caveat: DecodedCaveat): string {
  return caveat.description;
}

export function generateRandomSalt(): Hex {
  const bytes = new Array(32).fill(0).map(() => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  );
  return `0x${bytes.join('')}` as Hex;
}

export function generateMockSignature(): Hex {
  const bytes = new Array(65).fill(0).map(() => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  );
  return `0x${bytes.join('')}` as Hex;
}
