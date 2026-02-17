import type { Delegation, Address, Hex } from '@/types';
import { accounts } from './accounts';
import { sampleDecodedCaveats } from './caveats';
import { getSmartAccountsEnvironment } from '@/lib/smart-accounts-config';

export const ROOT_AUTHORITY: Hex = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

// Use real Delegation Framework v1.3.0 addresses from the environment config
const getEnforcerAddresses = () => {
  const env = getSmartAccountsEnvironment();
  return {
    allowedTargets: env.addresses.enforcers.allowedTargets as Address,
    nativeTokenTransferAmount: env.addresses.enforcers.nativeTokenTransferAmount as Address,
    erc20TransferAmount: env.addresses.enforcers.erc20TransferAmount as Address,
    timestamp: env.addresses.enforcers.timestamp as Address,
  };
};

export const sampleDelegations: Delegation[] = (() => {
  const ENFORCER_ADDRESSES = getEnforcerAddresses();
  
  return [
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
})();

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
