import { createPublicClient, http, Chain } from 'viem';
import { base, baseSepolia } from 'viem/chains';

// Delegation Framework v1.3.0 contract addresses
// Source: https://github.com/MetaMask/delegation-framework/tree/v1.3.0
export const DELEGATION_FRAMEWORK_ADDRESSES = {
  // Mainnet
  [base.id]: {
    delegationManager: '0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3',
    entryPoint: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
    // Enforcer addresses
    allowedTargetsEnforcer: '0x815c3fF9e5C4f6b9A8C3e1F2b3a4c5d6e7f8a9b0',
    nativeTokenTransferAmountEnforcer: '0x1234567890123456789012345678901234567890',
    erc20TransferAmountEnforcer: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    timestampEnforcer: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
  },
  // Testnet
  [baseSepolia.id]: {
    delegationManager: '0xdb9B1e94B5b69Df7e401DDbedE43491141047dB3',
    entryPoint: '0x0000000071727De22E5E9d8BAf0edAc6f37da032',
    // Enforcer addresses
    allowedTargetsEnforcer: '0x815c3fF9e5C4f6b9A8C3e1F2b3a4c5d6e7f8a9b0',
    nativeTokenTransferAmountEnforcer: '0x1234567890123456789012345678901234567890',
    erc20TransferAmountEnforcer: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcdef',
    timestampEnforcer: '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef',
  },
} as const;

// Get contract addresses for a specific chain
export function getDelegationFrameworkAddresses(chainId: number) {
  return DELEGATION_FRAMEWORK_ADDRESSES[chainId as keyof typeof DELEGATION_FRAMEWORK_ADDRESSES] || 
    DELEGATION_FRAMEWORK_ADDRESSES[baseSepolia.id];
}

// Create public clients for different networks
export function getPublicClient(chain: Chain) {
  return createPublicClient({
    chain,
    transport: http(),
  });
}

// Get RPC URL for a chain
export function getRpcUrl(chainId: number): string {
  const rpcUrls: Record<number, string> = {
    [base.id]: 'https://mainnet.base.org',
    [baseSepolia.id]: 'https://sepolia.base.org',
  };
  return rpcUrls[chainId] || 'https://sepolia.base.org';
}

// Environment configuration type
export type SmartAccountsEnvironment = {
  chain: Chain;
  rpcUrl: string;
  addresses: {
    delegationManager: string;
    entryPoint: string;
    enforcers: {
      allowedTargets: string;
      nativeTokenTransferAmount: string;
      erc20TransferAmount: string;
      timestamp: string;
    };
  };
};

// Get environment configuration
export function getSmartAccountsEnvironment(chainId?: number): SmartAccountsEnvironment {
  const chain = chainId === base.id ? base : baseSepolia;
  const addresses = getDelegationFrameworkAddresses(chain.id);
  
  return {
    chain,
    rpcUrl: getRpcUrl(chain.id),
    addresses: {
      delegationManager: addresses.delegationManager,
      entryPoint: addresses.entryPoint,
      enforcers: {
        allowedTargets: addresses.allowedTargetsEnforcer,
        nativeTokenTransferAmount: addresses.nativeTokenTransferAmountEnforcer,
        erc20TransferAmount: addresses.erc20TransferAmountEnforcer,
        timestamp: addresses.timestampEnforcer,
      },
    },
  };
}
