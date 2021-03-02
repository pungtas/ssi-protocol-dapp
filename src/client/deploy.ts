import { Account, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js';
import { InitializeMintParams } from '../instructions';
import tyronsol, { TransitionTag } from '../transactions/tyronsol';

async function main() {

        const x = await tyronsol.initialize();
        const tag = TransitionTag.InitMint;
        const InitMintParams: InitializeMintParams = {
            mint: x.mint.publicKey,
            decimals: 12,
            mintAuthority: x.controller.publicKey,
        };
        const params = {
            InitMint: InitMintParams
        };

        const mintAccountSpace = 82;
        const mintAccountLamports = await x.connection.getMinimumBalanceForRentExemption(mintAccountSpace);
        const transaction_instruction = await tyronsol.transactionData(tag, params, x.program);
        await sendAndConfirmTransaction(
            x.connection,
            new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: x.controller.publicKey,
                    newAccountPubkey: x.mint.publicKey,
                    space: mintAccountSpace,
                    lamports: mintAccountLamports,
                    programId: x.program,
                }),
                transaction_instruction
            ),
            [x.controller, x.mint], 
            {
                skipPreflight: false,
                commitment: 'recent',
                preflightCommitment: 'recent',
            }
        ).then( result => console.log(`Result is: ${result}`))
        .catch((_err: any) => { console.log(`${_err}`) })
}

main().then(
    () => process.exit(),
    err => {
      console.error(err);
      process.exit(-1);
    },
  );
