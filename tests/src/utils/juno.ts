import * as fs from 'fs'
import { Coin, DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import axios from 'axios';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { QueryClient, SigningStargateClient, StargateClient } from '@cosmjs/stargate';

const fee = { amount: [{ amount: "1000000", denom: "ujunox" }], gas: "30000000" };

export async function getJunoConnection(signer?: DirectSecp256k1HdWallet | string): Promise<{
  cosmWasmClient: SigningCosmWasmClient,
  stargateClient: SigningStargateClient,
  defaultAddress: string
}> {
  let rpc = 'http://localhost:26657';
  let wallet: DirectSecp256k1HdWallet;
  
  if (signer && typeof signer === 'string') {
    wallet = await DirectSecp256k1HdWallet.fromMnemonic(signer, { prefix: "sei", });
  }
  else if (signer) {
    wallet = signer as DirectSecp256k1HdWallet;
  }
  else {
    wallet = await DirectSecp256k1HdWallet.generate(12, { prefix: "juno" });
  }
  const defaultAddress = (await wallet.getAccounts())[0].address;
  let cosmWasmClient = await SigningCosmWasmClient.connectWithSigner(rpc, wallet);
  let stargateClient = await SigningStargateClient.connectWithSigner(rpc, wallet);
  return { cosmWasmClient, stargateClient, defaultAddress };
}

export async function getGenesisWallet(): Promise<DirectSecp256k1HdWallet> {
  return await DirectSecp256k1HdWallet.fromMnemonic("clip hire initial neck maid actor venue client foam budget lock catalog sweet steak waste crater broccoli pipe steak sister coyote moment obvious choose", { prefix: "juno" });
}

export async function storeAndInitContract(client: SigningCosmWasmClient, sender: string, contractPath: string, initMsg: any, label: string, funds?: Coin[]): Promise<string> {
  const bytecode = fs.readFileSync(contractPath) as Uint8Array;
  const storeTx = await client.upload(sender, bytecode, fee);
  const instantiate = await client.instantiate(sender, storeTx.codeId, initMsg, label, fee, { funds });

  return instantiate.contractAddress;
}


export async function requestFaucetTokensConstantine(address: string, coin: string): Promise<boolean> {
  const response = await axios.post("https://localhost:5000/", {
    address,
    coins: [
      coin
    ]
  });

  return response.status == 200;
}