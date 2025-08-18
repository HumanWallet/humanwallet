import type { Address, Hex } from 'viem';

export interface SDKConfig {
  rpcUrl: string;
  chainId: number;
}

export interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
}

export interface TxResult {
  hash: Hex;
}
