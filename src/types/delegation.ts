import type { Hex, Address } from './common';

/**
 * A delegation is a signed statement that gives a delegate permission to
 * act on behalf of a delegator. The permissions are defined by a set of caveats.
 */
export type Delegation = {
  /** The address of the delegate (receiving permission) */
  delegate: Address;
  /** The address of the delegator (granting permission) */
  delegator: Address;
  /** The hash of the parent delegation, or root authority hash */
  authority: Hex;
  /** The terms/restrictions of the delegation */
  caveats: Caveat[];
  /** Salt used to generate the delegation signature */
  salt: Hex;
  /** The signature of the delegation */
  signature: Hex;
};

/** An unsigned delegation (before signing) */
export type UnsignedDelegation = Omit<Delegation, 'signature'>;

/**
 * A caveat is a condition that must be met for a delegation to be valid.
 */
export type Caveat = {
  /** Contract address that enforces the caveat */
  enforcer: Address;
  /** Encoded parameters for the enforcer */
  terms: Hex;
  /** Optional runtime arguments */
  args: Hex;
};

/** Available caveat types in the playground */
export type CaveatType = 
  | 'allowedTargets'
  | 'nativeTokenTransferAmount'
  | 'erc20TransferAmount'
  | 'timestamp';

/** Human-readable decoded caveat representations */
export type DecodedCaveat = 
  | { type: 'allowedTargets'; targets: Address[]; description: string }
  | { type: 'nativeTokenTransferAmount'; maxAmount: bigint; description: string }
  | { type: 'erc20TransferAmount'; tokenAddress: Address; tokenSymbol: string; maxAmount: bigint; description: string }
  | { type: 'timestamp'; afterThreshold?: number; beforeThreshold?: number; description: string };

/** Caveat metadata for UI display */
export type CaveatMeta = {
  type: CaveatType;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  color: string; // Tailwind color class
};

/** Redemption step status */
export type RedemptionStepStatus = 'pending' | 'active' | 'completed' | 'failed';

/** Redemption flow step */
export type RedemptionStep = {
  id: string;
  name: string;
  description: string;
  status: RedemptionStepStatus;
  details?: string;
};
