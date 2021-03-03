import React from "react";
import * as ReactNative from 'react-native';
import * as Themed from '../../components/Layout/Themed';
import * as Scheme from 'tyronzil-js/dist/did/tyronZIL-schemes/did-scheme';
import * as DidResolver from 'tyronzil-js/dist/did/operations/did-resolve/resolver';
import * as TyronZIL from 'tyronzil-js/dist/blockchain/tyronzil';
import * as zcrypto from '@zilliqa-js/crypto';
import { BN as zilBN } from '@zilliqa-js/util';
import * as zil from '@zilliqa-js/account';
import * as SsiState from 'tyronzil-js/dist/blockchain/ssi-state';
import tyronsol, { TransitionTag } from "../../transactions/tyronsol";
import { Account, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";
import * as Instructions from "../../instructions";
import BN from 'bn.js';
import { establishConnection } from "../../client/init";
import { newAccountWithLamports } from "../../client/util/new-account-with-lamports";
import { TokenInstructionLayout } from "../../instructions";

var hash = require('hash.js');

const NETWORK_NAMESPACE = Scheme.NetworkNamespace.Testnet;
const INIT_TYRON = "0x83715890960608c7d6ca4f31ad288a8d2780d344";
const SSIkey = "0937d53364ae36bf3343c97e4a449d1edb0ec84c88f3f1ea89a0a18c6779fc6a";
									
export const TransferXZilView = () => {

	const [originator, setOriginator] = React.useState("");
	const [beneficiary, setBeneficiary] = React.useState("");
	const [amount, setAmount] = React.useState("");
	const STATE = { loading: false };
	const [state, setState] = React.useState(STATE);
	const [state2, setState2] = React.useState(STATE);
	const [receipt, setReceipt] = React.useState("");

	return (
    <ReactNative.View style={ Themed.styles.pungMeContainer }>
		<ReactNative.Text style={ Themed.styles.title }>xTransfer</ReactNative.Text>
		<Themed.View style={ Themed.styles.separator } lightColor="#e8e357" darkColor="#e8e357" />
		<ReactNative.TextInput
			value = { originator }
			style = { Themed.styles.pungMeText }
			placeholder = "Originator: Your username.ssi"
			onChangeText = { (originator: any) => { setOriginator(originator) }}
		/>
		<ReactNative.TextInput
			value = { beneficiary }
			style = { Themed.styles.pungMeText }
			placeholder = "Beneficiary: Recipient.ssi"
			onChangeText = { (beneficiary: any) => { setBeneficiary(beneficiary) }}
		/>
		<ReactNative.TextInput
			value = { amount }
			style = { Themed.styles.pungMeText }
			placeholder = "Enter amount of xZIL"
			onChangeText = { (amount: any) => { setAmount(amount) }}
		/>
		<Submit
		content = {`Sign with your SSI Key to send ${amount} $ZIL to the bridge`}
		state = { state }
		onSubmission = { async() => {
			setState({
				loading: true
			});
			
			const ORIGINATOR_ADDR = await DidResolver.default.resolveDns(NETWORK_NAMESPACE, INIT_TYRON, originator);
			const BENEFICIARY_SSI_ADDR = await DidResolver.default.resolveDns(NETWORK_NAMESPACE, INIT_TYRON, beneficiary);
			
			await SsiState.default.fetch(
				NETWORK_NAMESPACE,
				BENEFICIARY_SSI_ADDR
			).then( async state => {
				return state.solana_addr;
			}).then( async solana_addr => { 

			const PRIVATE_KEY = zcrypto.normalizePrivateKey(SSIkey);
			const PUBLIC_KEY = zcrypto.getPubKeyFromPrivateKey(PRIVATE_KEY);
			
			const amount_bn = new zilBN(amount);
			const uint_amt = Uint8Array.from(amount_bn.toArrayLike(Buffer, undefined, 16));
			
			const to_hash = hash.sha256().update(Buffer.from(solana_addr)).digest('hex');
			const amount_hash = hash.sha256().update(uint_amt).digest('hex');
			
			const SIGNED_DATA = to_hash + amount_hash;
			const SIGNATURE = "0x"+ zcrypto.sign(Buffer.from(SIGNED_DATA, 'hex'), PRIVATE_KEY, PUBLIC_KEY);

			const vasp_account = await TyronZIL.default.initialize(
				NETWORK_NAMESPACE,
				INIT_TYRON,
				"8cefad33c6b2eafe6456e80cd69fda3fcd23b5c4a6719275340f340a9259c26a",		// private key that pays for the gas
				50000
			);
			
			const transition_params = await TyronZIL.default.xZIL(
				String(Number(amount)*1e12),
				"0x"+ SIGNED_DATA,
				SIGNATURE,
				String(solana_addr)
			);

				return {
					account: vasp_account,
					params: transition_params
				}
			}).then( async (input: { account: any; params: any; }) => {
				const transaction = await TyronZIL.default.submit(
					TyronZIL.TransitionTag.Xzil,
					input.account,
					ORIGINATOR_ADDR,
					String(Number(amount)*1e12),
					input.params
				);
				
				if (transaction instanceof zil.Transaction) {
					const tx = transaction as zil.Transaction;
					const RECEIPT = tx.getReceipt() as zil.TxReceipt;
					const xZIL_event = RECEIPT?.event_logs[0];
					alert!(`Transfer on Zilliqa consumed ${RECEIPT!.cumulative_gas} units of gas. \n Event: ${JSON.stringify(xZIL_event, null, 2)}`);
					setReceipt(JSON.stringify(RECEIPT));
				}

				setState({
					loading: false
				});
			})
			.catch((_err: any) => { alert!(`${_err}`) })
		}}
		/>
		<Submit
		content = {`Send FATF Travel Rule message along with ${amount} xZIL to ${beneficiary}`}
		state = { state2 }
		onSubmission = { async() => {
			setState2({
				loading: true
			});
			
			let originator_sol: PublicKey;
			let beneficiary_sol: PublicKey;
			let transfer_amount;

			const RECEIPT = JSON.parse(receipt) as zil.TxReceipt;
			const receipt_params = RECEIPT.event_logs[0].params;

			for(const object of receipt_params) {
				switch (object.vname) {
					case "originator":
						originator_sol = new PublicKey(object.value)
						break;
					case "beneficiary":
						beneficiary_sol = new PublicKey(object.value)
						break;
					case "amount":
						transfer_amount = object.value
						break;
				}
			}
			alert!(`${originator}, ${beneficiary}, ${transfer_amount}`)

			const connection = await establishConnection();
			const controller = await newAccountWithLamports(connection, 1e12);
			const program = new PublicKey("E3thxfAbr9CwXQPRi6XzG5SkxEaaxsky4LBxwe5wPjrs");

			const x = await tyronsol.initialize();

			const account_space =  TokenInstructionLayout.span;
			const account_lamports = await x.connection.getMinimumBalanceForRentExemption(
				TokenInstructionLayout.span,
			);
			
			const mint = new Account();
			const mintAccountSpace = 82;
			const mintAccountLamports = await connection.getMinimumBalanceForRentExemption(mintAccountSpace);
		
			const tag = TransitionTag.MintTo;
			const mintToParams: Instructions.MintToParams = {
				mint: mint.publicKey,
				destination: originator_sol!,
				amount: new BN(transfer_amount),
				mintAuthority: controller.publicKey,
			};
			const params = { MintTo: mintToParams };
			const transaction_instruction = await tyronsol.transactionData(tag, params, program);
			await sendAndConfirmTransaction(
				connection,
				new Transaction().add(
					SystemProgram.createAccount({
						fromPubkey: controller.publicKey,
						newAccountPubkey: mint.publicKey,
						space: mintAccountSpace,
						lamports: mintAccountLamports,
						programId: program,
					}),
					transaction_instruction
				),
				[controller, mint],
				{
					skipPreflight: false,
					commitment: 'recent',
					preflightCommitment: 'recent',
				}
			).then( result => alert!(`Result is: ${result}`))
			.catch((_err: any) => { alert!(`Error: ${_err}`) })

				const x_tag = TransitionTag.Transfer;
				const msg = ["hola"];
				const transferParams: Instructions.TransferParams = {
					originator: originator_sol!,
					beneficiary: beneficiary_sol!,
					amount: new BN(transfer_amount),
					controller: controller.publicKey,
					message: msg
				};
				const x_params = { Transfer: transferParams };
				const x_transaction_instruction = await tyronsol.transactionData(x_tag, x_params, program);
				await sendAndConfirmTransaction(
					connection,
					new Transaction().add(x_transaction_instruction),
					[controller], 
					{
						skipPreflight: false,
						commitment: 'recent',
						preflightCommitment: 'recent',
					}
				).then( result => alert!(`Result is: ${result}`))
				.catch((_err: any) => { alert!(`Error: ${_err}`) })

				setState2({
					loading: false
				});
				setOriginator("");
				setBeneficiary("");
				setAmount("");
			}}
		/>
	</ReactNative.View>
  );
};

function Submit({ content, onSubmission, state }: { content: any, onSubmission: any, state: any }) {
	return <ReactNative.TouchableOpacity onPress={onSubmission} style={Themed.styles.button}>
		<Themed.Text style={Themed.styles.buttonText}>{ content }</Themed.Text>
		{
			state.loading &&
			<ReactNative.ActivityIndicator size="large" color="#e8e357" />
		}
	</ReactNative.TouchableOpacity>
}
