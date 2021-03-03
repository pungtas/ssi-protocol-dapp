import { Account, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import tyronsol, { TransitionTag } from '../transactions/tyronsol';
import { loadProgram } from './init';
import { Store } from './util/store';

async function main() {    
        const x = await tyronsol.initialize();
        let mint = new Account();
        let originator = new Account();
        let originator_ssi = new Account();
        let beneficiary = new Account();
        let beneficiary_ssi = new Account();
                
        await loadProgram(x.connection,x.controller, mint);
            
        const store = new Store();
        const config = await store.load('config.json');
        const program = new PublicKey(config.programId);

        const mint_tag = TransitionTag.InitMint;
        const account_tag = TransitionTag.InitAccount;

        const mint_params = {
            InitMint: {
                mint: mint.publicKey,
                decimals: 12,
                mintAuthority: x.controller.publicKey,
            }
        };
        const originator_params = {
            InitAccount: {
                account: originator_ssi.publicKey,
                mint: mint.publicKey,
                owner: originator.publicKey
            }
        };
        const beneficiary_params = {
            InitAccount: {
                account: beneficiary_ssi.publicKey,
                mint: mint.publicKey,
                owner: beneficiary.publicKey
            }
        };

        //const account_space = thisTokenAccount.span;
        //const account_lamports = await tyronsol.getMinBalanceRentForExemptAccount(x.connection);
        
        const mint_instruction = await tyronsol.transactionData(mint_tag, mint_params, program);
        const originator_account = await tyronsol.transactionData(account_tag, originator_params, program);
        const beneficiary_account = await tyronsol.transactionData(account_tag, beneficiary_params, program);

        await sendAndConfirmTransaction(
            x.connection,
            new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: x.controller.publicKey,
                    newAccountPubkey: mint.publicKey,
                    space: 82,
                    lamports: await x.connection.getMinimumBalanceForRentExemption(82),
                    programId: program,
                }),
                mint_instruction,/*
                SystemProgram.createAccount({
                    fromPubkey: x.controller.publicKey,
                    newAccountPubkey: originator_ssi.publicKey,
                    space: 82,
                    lamports: await x.connection.getMinimumBalanceForRentExemption(82),
                    programId: program,
                }),
                originator_account,
                SystemProgram.createAccount({
                    fromPubkey: x.controller.publicKey,
                    newAccountPubkey: beneficiary_ssi.publicKey,
                    space: 82,
                    lamports: await x.connection.getMinimumBalanceForRentExemption(82),
                    programId: program,
                }),
                beneficiary_account*/
            ),
            [x.controller, mint, /*originator_ssi, beneficiary_ssi*/ ], 
            {
                skipPreflight: false,
                commitment: 'recent',
                preflightCommitment: 'recent',
            }
        ).then( result => {
            console.log(`New token mint + account initializations. Transaction: ${result}`);
            console.log(`SSI Agent: ${x.controller.publicKey.toBase58()}`);
            console.log(`New originator SSI address: ${originator_ssi.publicKey.toBase58()}`);
            console.log(`New beneficiary SSI address: ${beneficiary_ssi.publicKey.toBase58()}`);
        })
        .catch((_err: any) => { console.log(`${_err}`) })
}

main().then(
    () => process.exit(),
    err => {
      console.error(err);
      process.exit(-1);
    },
  );
