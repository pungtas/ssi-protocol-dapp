import * as API from '@zilliqa-js/zilliqa';
import { StatusType, MessageType } from '@zilliqa-js/subscriptions';

export default class Relayer {
    static deposit: xZILdeposit;

    public static async listen(): Promise<void> {
    const zilliqa = new API.Zilliqa('https://dev-api.zilliqa.com');
    const subscriber = zilliqa.subscriptionBuilder.buildEventLogSubscriptions(
        'wss://dev-ws.zilliqa.com',
        {
        // smart contract address you want to listen on  
        addresses: [
            '0x2ce491a0fd9e318b39172258101b7c836da7449b'
        ],
        },
    );
    
    subscriber.emitter.on(StatusType.SUBSCRIBE_EVENT_LOG, (event:any) => {
        // if subscribe success, it will echo the subscription info
        console.log('get SubscribeEventLog echo: ', event);
    });
    
    subscriber.emitter.on(MessageType.EVENT_LOG, (event: any) => {
        const PARAMS = event.value[0].event_logs[0].params;

        let ORIGINATOR;
        let BENEFICIARY;
        let AMOUNT;

        for(let i=0, t= PARAMS.length; i<t; ++i) {
            if(PARAMS[i].vname === "originator") {
                ORIGINATOR = PARAMS[i].value
            }
            if(PARAMS[i].vname === "beneficiary") {
                BENEFICIARY = PARAMS[i].value
            }
            if(PARAMS[i].vname === "amount") {
                AMOUNT = PARAMS[i].value
            }
        }
            
        this.deposit = {
            originator: ORIGINATOR,
            beneficiary: BENEFICIARY,
            amount: AMOUNT
        };
    });
    
    subscriber.emitter.on(MessageType.UNSUBSCRIBE, (event: any) => {
        //if unsubscribe success, it will echo the unsubscription info
        console.log('get unsubscribe event: ', event);
    });

    await subscriber.start();
    }
}

export interface xZILdeposit {
    originator: string,
    beneficiary: string,
    amount: string
}