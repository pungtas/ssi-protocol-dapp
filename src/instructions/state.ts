import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { bool, Layout, option, publicKey, u64, u8, struct } from '@project-serum/borsh';
//import * as BufferLayout from "buffer-layout";

export interface Mint {
  mintAuthority: PublicKey | null;
  supply: BN;
  decimals: number;
  initialized: boolean;
}

export interface TokenAccount {
  mint: PublicKey;
  owner: PublicKey;
  amount: BN;
  delegate: PublicKey | null;
  state: number;
  native: BN | null;
  delegatedAmount: BN;
  closeAuthority: PublicKey | null;
}

export const Mint: Layout<Mint> = struct([
  option(publicKey(), 'mintAuthority'),
  u64('supply'),
  u8('decimals'),
  bool('initialized'),
]);

/**
export const pubKey = (property = "publicKey"): unknown => {
  return BufferLayout.blob(32, property);
};

export const thisTokenAccount: typeof BufferLayout.Structure = BufferLayout.struct(
  [
    pubKey('mint'),
    pubKey('owner'),
    BufferLayout.u64('amount'),
    BufferLayout.option(pubKey(), 'delegate'),
    BufferLayout.u8('state'),
    BufferLayout.option(u64(), 'delegatedAmount'),
    BufferLayout.option(pubKey(), 'closeAuthority'),
  ]
);
*/

export const TokenAccountLayout: Layout<TokenAccount> = struct([
  publicKey('mint'),
  publicKey('owner'),
  u64('amount'),
  option(publicKey(), 'delegate'),
  u8('state'),
  option(u64(), 'delegatedAmount'),
  option(publicKey(), 'closeAuthority'),
]);

export function decodeMintAccountData(data: Buffer): Mint {
  return Mint.decode(data);
}

export function decodeTokenAccountData(data: Buffer): TokenAccount {
  return TokenAccountLayout.decode(data);
}
