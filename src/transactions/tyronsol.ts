import { Connection, Account, PublicKey, TransactionInstruction } from "@solana/web3.js";
import { establishConnection, establishController } from "../client/init";
import * as Instructions from "../instructions";

/** tyronsol transaction class */
export default class tyronsol{
	public readonly connection: Connection;
	public readonly controller: Account;
    public readonly program = new PublicKey("2ekQTdfPjgeFuLXjRptxuk8pKj3YGzpw5rozRzSADGCE");
    public readonly mint = new PublicKey("9VNJQywv7RdUZZqEHtVMtzuN6FyHeMztcWnrNkivTqw");
     
	private constructor(
		connection: Connection,
        controller: Account,
	) {
		this.connection = connection;
        this.controller = controller;
	}

	public static async initialize(
	): Promise<tyronsol> {
        const init = await establishConnection()
        .then( async connection => {
            const x = await establishController(connection)
            .then( async (controller: Account) => {
                
                return {
                    connection,
                    controller,
                }
            })
                
            return new tyronsol(
                connection,
                x.controller,
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
    public static async getMinBalanceRentForExemptAccount(
        connection: Connection,
        layout: any,
        ): Promise<number> {
        return await connection.getMinimumBalanceForRentExemption(
            layout.span as number,
            "recent"
        );
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
