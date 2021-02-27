import React, { useCallback } from "react";
import { useConnection } from "../../contexts/connection";
import { useWallet } from "../../contexts/wallet";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { notify } from "../../utils/notifications";
import { LABELS } from "../../constants";
import Relayer from "../../relayer/relayer";
import * as ReactNative from 'react-native';
import * as Themed from '../../components/Layout/Themed';

export const TransferXZilView = () => {
  const deposit = async () => {
    await Relayer.listen();
    return Relayer.deposit;
  };
  console.log(JSON.stringify(deposit));
  
  const connection = useConnection();
  const { publicKey } = useWallet();

  const airdrop = useCallback(() => {
    if (!publicKey) {
      return;
    }

    connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL).then(() => {
      notify({
        message: LABELS.ACCOUNT_FUNDED,
        type: "success",
      });
    });
  }, [publicKey, connection]);

  const [originator, setOriginator] = React.useState("");
  const [SSIkey, setSSIkey] = React.useState("");
  const [beneficiary, setBeneficiary] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const STATE = { loading: false };
  const [state, setState] = React.useState(STATE);

  return (
    <ReactNative.View style={ Themed.styles.pungMeContainer }>
		<ReactNative.Text style={ Themed.styles.title }>xTransfer</ReactNative.Text>
		<Themed.View style={ Themed.styles.separator } lightColor="#e8e357" darkColor="#e8e357" />
		<ReactNative.TextInput
			value = { originator }
			style = { Themed.styles.pungMeText }
			placeholder = "Originator"
			onChangeText = { (originator: any) => {
				setOriginator(originator)
			}}
		/>
		<ReactNative.TextInput
			value = { SSIkey }
			style = { Themed.styles.pungMeText }
			placeholder = "SSI key"
			onChangeText = { (SSIkey: React.SetStateAction<string>) => {
				setSSIkey(SSIkey)
			}}
		/>
		<ReactNative.TextInput
			value = { beneficiary }
			style = { Themed.styles.pungMeText }
			placeholder = "Beneficiary"
			onChangeText = { (beneficiary: any) => {
				setBeneficiary(beneficiary)
			}}
		/>
		<ReactNative.TextInput
			value = { amount }
			style = { Themed.styles.pungMeText }
			placeholder = "Amount of $xZIL"
			onChangeText = { (amount: any) => {
				setAmount(amount)
			}}
		/>
		<Submit
			title = {`Transfer ${ amount } $xZIL + send FATF travel rule message`}
			state = { state }
			onSubmission = { async() => {
				setState({
					loading: true
				});
		}}
		/>
	</ReactNative.View>
  );
};

function Submit({ title, onSubmission, state }: { title: any, onSubmission: any, state: any }) {
	return <ReactNative.TouchableOpacity onPress={onSubmission} style={Themed.styles.button}>
		<Themed.Text style={Themed.styles.buttonText}>{title}</Themed.Text>
		{
			state.loading &&
			<ReactNative.ActivityIndicator size="large" color="#000" />
		}
	</ReactNative.TouchableOpacity>
}
