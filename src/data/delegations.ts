import type { Delegation, Address, Hex } from '@/types';
import { accounts } from './accounts';
import { sampleDecodedCaveats } from './caveats';

export const ROOT_AUTHORITY: Hex = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const ENFORCER_ADDRESSES = {
  allowedTargets: '0x1111111111111111111111111111111111111111' as Address,
  nativeTokenTransferAmount: '0x2222222222222222222222222222222222222222' as Address,
  erc20TransferAmount: '0x3333333333333333333333333333333333333333' as Address,
  timestamp: '0x4444444444444444444444444444444444444444' as Address,
};

export const sampleDelegations: Delegation[] = [
  {
    delegate: accounts[1].address,
    delegator: accounts[0].address,
    authority: ROOT_AUTHORITY,
    caveats: [
      {
        enforcer: ENFORCER_ADDRESSES.nativeTokenTransferAmount,
        terms: '0x0000000000000000000000000000000000000000000000000de0b6b3a7640000' as Hex,
        args: '0x' as Hex,
      },
      {
        enforcer: ENFORCER_ADDRESSES.allowedTargets,
        terms: '0x0000000000000000000000006789012345678901234567890123456789012345' as Hex,
        args: '0x' as Hex,
      },
    ],
    salt: '0x0000000000000000000000000000000000000000000000000000000000000001' as Hex,
    signature: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab' as Hex,
  },
  {
    delegate: accounts[2].address,
    delegator: accounts[1].address,
    authority: '0xaabbccdd11223344556677889900aabbccdd11223344556677889900aabbccdd' as Hex,
    caveats: [
      {
        enforcer: ENFORCER_ADDRESSES.erc20TransferAmount,
        terms: '0x000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb480000000000000000000000000000000000000000000000000000000001dcd6500' as Hex,
        args: '0x' as Hex,
      },
      {
        enforcer: ENFORCER_ADDRESSES.timestamp,
        terms: '0x' as Hex,
        args: '0x' as Hex,
      },
    ],
    salt: '0x0000000000000000000000000000000000000000000000000000000000000002' as Hex,
    signature: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12' as Hex,
  },
];

export function getDelegationsByDelegator(address: Address): Delegation[] {
  return sampleDelegations.filter(
    d => d.delegator.toLowerCase() === address.toLowerCase()
  );
}

export function getDelegationsByDelegate(address: Address): Delegation[] {
  return sampleDelegations.filter(
    d => d.delegate.toLowerCase() === address.toLowerCase()
  );
}

export function getDelegationId(delegation: Delegation): string {
  return `${delegation.delegator}-${delegation.delegate}-${delegation.salt}`;
}

export function getDecodedCaveats(delegationId: string) {
  const index = sampleDelegations.findIndex(d => getDelegationId(d) === delegationId);
  if (index === 0) return sampleDecodedCaveats['delegation-1'];
  if (index === 1) return sampleDecodedCaveats['delegation-2'];
  return [];
}
