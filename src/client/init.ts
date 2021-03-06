/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
  Connection,
  Account,
  BpfLoader,
  BPF_LOADER_PROGRAM_ID,
  PublicKey,
} from '@solana/web3.js';
import fs from 'mz/fs';
import { url, urlTls } from './util/url';
import { Store } from './util/store';
import { newAccountWithLamports } from './util/new-account-with-lamports';

let connection: Connection;
let programId: PublicKey;

const pathToProgram = 'program/target/deploy/ssi_protocol_dapp.so';

/**
 * Establish a connection to the cluster
 */
export async function establishConnection(): Promise<Connection> {
  connection = new Connection(url, 'singleGossip');
  const version = await connection.getVersion();
  console.log('Connection to cluster established:', url, version);
  return connection;
}

/**
 * Establish an account to pay for the transfer cost => SSI Agent
 */
export async function establishController(connection: Connection): Promise<Account> {
    let fees = 0;
    const {feeCalculator} = await connection.getRecentBlockhash();

    // Calculate the cost to load the program
    const data = await fs.readFile(pathToProgram);
    const NUM_RETRIES = 500; // allow some number of retries
    fees +=
      feeCalculator.lamportsPerSignature *
        (BpfLoader.getMinNumSignatures(data.length) + NUM_RETRIES) +
      (await connection.getMinimumBalanceForRentExemption(data.length));

    // Calculate the cost of sending the transactions
    fees += feeCalculator.lamportsPerSignature * 100; // wag

    // Fund a new payer via airdrop
    const controller = await newAccountWithLamports(connection, fees);
    return controller;
}

/**
 * Load the BPF program if not already loaded
 */
export async function loadProgram(
  connection: Connection,
  controller: Account
  ): Promise<void> {
  
  const store = new Store();

  // Check if the program has already been loaded
  try {
    const config = await store.load('config.json');
    programId = new PublicKey(config.programId);
    await connection.getAccountInfo(programId);
    console.log(`SSI Program already loaded to account ${programId.toBase58()}`);
    return;
  } catch (err) {
    // load the program
  }
  console.log('Loading the SSI Protocol Program...');
  const data = await fs.readFile(pathToProgram);
  const programAccount = new Account();
  await BpfLoader.load(
    connection,
    controller,
    programAccount,
    data,
    BPF_LOADER_PROGRAM_ID,
  );
  programId = programAccount.publicKey;
  console.log(`Program loaded to account ${programId.toBase58()}`);
        
  // Save this info for next time
  await store.save('config.json', {
    url: urlTls,
    programId: programId.toBase58(),
    controller: controller.publicKey.toBase58()
  });
}
