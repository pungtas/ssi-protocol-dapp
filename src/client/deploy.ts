import { Account, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import { AccountLayout } from '@solana/spl-token';
import tyronsol, { TransitionTag } from '../transactions/tyronsol';
import { loadProgram } from './init';
import { Store } from './util/store';
import BN from 'bn.js';

async function main() {    
        const x = await tyronsol.initialize();
        let mint = new Account();
                
        await loadProgram(x.connection,x.controller);
            
        const store = new Store();
        const config = await store.load('config.json');
        const program = new PublicKey(config.programId);

        const mint_tag = TransitionTag.InitMint;
        const mint_params = {
            InitMint: {
                mint: mint.publicKey,
                decimals: 12,
                mintAuthority: x.controller.publicKey,
            }
        };
        const mint_instruction = await tyronsol.transactionData(mint_tag, mint_params, program);
        
        let originator = new Account();
        let originator_ssi = new Account();
        let beneficiary = new Account();
        let beneficiary_ssi = new Account();
        
        const account_tag = TransitionTag.InitAccount;

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

        const account_space = AccountLayout.span as number;
        const account_lamports = await tyronsol.getMinBalanceRentForExemptAccount(x.connection, AccountLayout);
        
        const originator_instruction = await tyronsol.transactionData(account_tag, originator_params, program);
        const beneficiary_instruction = await tyronsol.transactionData(account_tag, beneficiary_params, program);
        
        const mint_to_tag = TransitionTag.MintTo;
        const mint_to_params = { 
            MintTo: {
                mint: mint.publicKey,
                destination: originator_ssi.publicKey,
                amount: new BN(10000000000000),
                mintAuthority: x.controller.publicKey,
            }
        };
        const mint_to_instruction = await tyronsol.transactionData(mint_to_tag, mint_to_params, program);
        
        const transfer_tag = TransitionTag.Transfer;

        const travel_rule = {
            originator: "Tralcan",
            country: "Arcturus"
        };
        const m = Buffer.from(JSON.stringify(travel_rule));
    
        const msg = {
            writer: originator_ssi.publicKey.toBuffer(),
            length: m.length,
            bytes: m
        };

        const message = new Array<Buffer>(255);

        const transfer_params = {
            Transfer: {
                originator: originator_ssi.publicKey,
                beneficiary: beneficiary_ssi.publicKey,
                amount: new BN(1000000000000),
                controller: x.controller.publicKey,
                message: message
            }
        };
        const transfer_instruction = await tyronsol.transactionData(transfer_tag, transfer_params, program);
        
        const result = await sendAndConfirmTransaction(
            x.connection,
            new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: x.controller.publicKey,
                    newAccountPubkey: mint.publicKey,
                    space: 82,
                    lamports: await x.connection.getMinimumBalanceForRentExemption(82),
                    programId: program,
                }),
                mint_instruction,
                SystemProgram.createAccount({
                    fromPubkey: x.controller.publicKey,
                    newAccountPubkey: originator_ssi.publicKey,
                    space: account_space,
                    lamports: account_lamports,
                    programId: program,
                }),
                originator_instruction,
                SystemProgram.createAccount({
                    fromPubkey: x.controller.publicKey,
                    newAccountPubkey: beneficiary_ssi.publicKey,
                    space: account_space,
                    lamports: account_lamports,
                    programId: program,
                }),
                beneficiary_instruction,
                //mint_to_instruction,
                //transfer_instruction
            ),
            [x.controller, mint, originator_ssi, beneficiary_ssi], 
            {
                skipPreflight: false,
                commitment: 'recent',
                preflightCommitment: 'recent',
            }
        );
        console.log(`SSI Agent: ${x.controller.publicKey.toBase58()}`);
        console.log(`Mint: ${mint.publicKey.toBase58()}`);
        console.log(`Originator SSI address on Solana: ${originator_ssi.publicKey.toBase58()}`);
        console.log(`Beneficiary SSI address on Solana: ${beneficiary_ssi.publicKey.toBase58()}`);
        console.log(`Transaction: ${result}`);
        
        /*
        const result2 = await sendAndConfirmTransaction(
            x.connection,
            new Transaction().add(
                mint_to_instruction,
                transfer_instruction
            ),
            [x.controller], 
            {
                skipPreflight: false,
                commitment: 'recent',
                preflightCommitment: 'recent',
            }
        );
        console.log(result2);
        //.catch((_err: any) => { console.log(`${_err}`) })*/
}

main().then(
    () => process.exit(),
    err => {
      console.error(err);
      process.exit(-1);
    },
  );
