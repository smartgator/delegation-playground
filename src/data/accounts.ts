import type { Account } from '@/types';

export const accounts: Account[] = [
  {
    id: 'alice',
    address: '0x1234567890123456789012345678901234567890',
    name: 'Alice',
    avatarColor: 'bg-pink-500',
    balance: '10.5 ETH',
  },
  {
    id: 'bob',
    address: '0x2345678901234567890123456789012345678901',
    name: 'Bob',
    avatarColor: 'bg-blue-500',
    balance: '5.2 ETH',
  },
  {
    id: 'carol',
    address: '0x3456789012345678901234567890123456789012',
    name: 'Carol',
    avatarColor: 'bg-green-500',
    balance: '3.8 ETH',
  },
  {
    id: 'dave',
    address: '0x4567890123456789012345678901234567890123',
    name: 'Dave',
    avatarColor: 'bg-orange-500',
    balance: '7.1 ETH',
  },
  {
    id: 'eve',
    address: '0x5678901234567890123456789012345678901234',
    name: 'Eve',
    avatarColor: 'bg-purple-500',
    balance: '2.9 ETH',
  },
];

export function getAccountById(id: string): Account | undefined {
  return accounts.find(a => a.id === id);
}

export function getAccountByAddress(address: string): Account | undefined {
  return accounts.find(a => a.address.toLowerCase() === address.toLowerCase());
}
