import { Connection, Account, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { establishConnection, establishController, loadProgram } from "../client/init";
import { Store } from '../client/util/store';
import * as Instructions from "../instructions";

/** tyronsol transaction class */
export default class tyronsol{
	public readonly connection: Connection;
	public readonly controller: Account;
    public readonly program: PublicKey;
    public readonly mint: Account;
    public readonly originator: Account;
    public readonly beneficiary: Account;
    
	private constructor(
		connection: Connection,
        controller: Account,
        program: PublicKey,
        mint: Account,
        originator: Account,
        beneficiary: Account,
	) {
		this.connection = connection;
        this.controller = controller;
        this.program = program;  
        this.mint = mint;
        this.originator = originator;
        this.beneficiary = beneficiary;
	}

	public static async initialize(
	): Promise<tyronsol> {
        const init = await establishConnection()
        .then( async connection => {
            const x = await establishController(connection)
            .then( async (controller: Account) => {
                const mint = new Account();
                const originator = new Account();
                const beneficiary = new Account();
                await loadProgram(connection, controller, mint, originator, beneficiary);
            
                const store = new Store();
                const config = await store.load('config.json');
                const program = new PublicKey(config.programId);

                return {
                    controller,
                    program,
                    mint,
                    originator,
                    beneficiary
                }
            })
                
            return new tyronsol(
                connection,
                x.controller,
                x.program,
                x.mint,
                x.originator,
                x.beneficiary
            );
            
        }).catch( err => { throw err });
        return init
	}

    public static async transactionData(
	    tag: TransitionTag,
        params: Instructions.Parameters,
        program: PublicKey
	): Promise<TransactionInstruction> {
        let transaction_instruction: TransactionInstruction;
        switch (tag) {
            case TransitionTag.InitMint: 
                transaction_instruction = Instructions.TokenInstructions.initializeMint(params.InitMint!, program);
                break;
            case TransitionTag.InitAccount:
                transaction_instruction = Instructions.TokenInstructions.initializeAccount(params.InitAccount!, program);
                break;
            case TransitionTag.Transfer:
                transaction_instruction = Instructions.TokenInstructions.transfer(params.Transfer!, program);
                break;
            case TransitionTag.Approve:
                transaction_instruction = Instructions.TokenInstructions.approve(params.Approve!, program);
                break;
            case TransitionTag.Revoke:
                transaction_instruction = Instructions.TokenInstructions.revoke(params.Revoke!, program);
                break;
            case TransitionTag.SetAuthority:
                transaction_instruction = Instructions.TokenInstructions.setAuthority(params.SetAuthority!, program);
                break;
            case TransitionTag.MintTo:
                transaction_instruction = Instructions.TokenInstructions.mintTo(params.MintTo!, program);
                break;
            case TransitionTag.CloseAccount:
                transaction_instruction = Instructions.TokenInstructions.closeAccount(params.CloseAccount!, program);
                break;
        }
		return transaction_instruction!;
    }
}

export enum TransitionTag {
    InitMint,
    InitAccount,
    Transfer,
    Approve,
    Revoke,
    SetAuthority,
    MintTo,
    Burn,
    CloseAccount
}
