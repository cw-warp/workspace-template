import * as fs from 'fs'
import { Coin, DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import axios from 'axios';
import { getSigningCosmWasmClient, getSigningStargateClient, getQueryClient } from '@sei-js/cosmjs';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClient } from '@cosmjs/stargate';
import { LCDQueryClient as AuthQueryClient } from '@sei-js/proto/dist/types/codegen/cosmos/auth/v1beta1/query.lcd';
import { LCDQueryClient as BankQueryClient } from '@sei-js/proto/dist/types/codegen/cosmos/bank/v1beta1/query.lcd';
import { LCDQueryClient as DistributionQueryClient } from '@sei-js/proto/dist/types/codegen/cosmos/distribution/v1beta1/query.lcd';
import { LCDQueryClient as GovQueryClient } from '@sei-js/proto/dist/types/codegen/cosmos/gov/v1beta1/query.lcd';
import { LCDQueryClient as StakingQueryClient } from '@sei-js/proto/dist/types/codegen/cosmos/staking/v1beta1/query.lcd';
import { LCDQueryClient as TxQueryClient } from '@sei-js/proto/dist/types/codegen/cosmos/tx/v1beta1/service.lcd';
import { LCDQueryClient as UpgradeQueryClient } from '@sei-js/proto/dist/types/codegen/cosmos/upgrade/v1beta1/query.lcd';
import { LCDQueryClient as DexQueryClient } from '@sei-js/proto/dist/types/codegen/seiprotocol/seichain/dex/query.lcd';
import { LCDQueryClient as EpochQueryClient } from '@sei-js/proto/dist/types/codegen/seiprotocol/seichain/epoch/query.lcd';
import { LCDQueryClient as MintQueryClient } from '@sei-js/proto/dist/types/codegen/seiprotocol/seichain/mint/v1beta1/query.lcd';
import { LCDQueryClient as OracleQueryClient } from '@sei-js/proto/dist/types/codegen/seiprotocol/seichain/oracle/query.lcd';
import { LCDQueryClient as TokenFactoryQueryClient } from '@sei-js/proto/dist/types/codegen/seiprotocol/seichain/tokenfactory/query.lcd';


const fee = { amount: [{ amount: "1000000", denom: "usei" }], gas: "30000000" };

export type QueryClient = {
  cosmos: {
    auth: { v1beta1: AuthQueryClient },
    bank: { v1beta1: BankQueryClient },
    distribution: { v1beta1: DistributionQueryClient },
    gov: { v1beta1: GovQueryClient },
    staking: { v1beta1: StakingQueryClient },
    tx: { v1beta1: TxQueryClient },
    upgrade: { v1beta1: UpgradeQueryClient }
  },
  seiprotocol: {
    seichain: {
      dex: DexQueryClient,
      epoch: EpochQueryClient,
      mint: MintQueryClient,
      oracle: OracleQueryClient,
      tokenfactory: TokenFactoryQueryClient
    }
  },
};

export async function getSeiConnection(signer?: DirectSecp256k1HdWallet | string): Promise<{
  queryClient: QueryClient,
  cosmWasmClient: SigningCosmWasmClient,
  stargateClient: SigningStargateClient,
  defaultAddress: string
}> {
  let rpc = 'http://localhost:26657';

  let queryClient = await getQueryClient(rpc);
  let wallet: DirectSecp256k1HdWallet;
  if (signer && typeof signer === 'string') {
    wallet = await DirectSecp256k1HdWallet.fromMnemonic(signer, { prefix: "sei", });
  }
  else if (signer) {
    wallet = signer as DirectSecp256k1HdWallet;
  }
  else {
    wallet = await DirectSecp256k1HdWallet.generate(12, { prefix: "sei" });
  }

  const defaultAddress = (await wallet.getAccounts())[0].address;
  let cosmWasmClient = await getSigningCosmWasmClient(rpc, wallet);
  let stargateClient = await getSigningStargateClient(rpc, wallet);
  return { queryClient, cosmWasmClient, stargateClient, defaultAddress };
}

export async function getGenesisWallet(): Promise<DirectSecp256k1HdWallet[]> {
  const wallets: DirectSecp256k1HdWallet[] = [];
  wallets.push(await DirectSecp256k1HdWallet.fromMnemonic("gown slim poem radar absent vapor leg rely edit fan subway because tribe near volume file excess fan chest story onion possible secret timber", { prefix: "sei" }));
  wallets.push(await DirectSecp256k1HdWallet.fromMnemonic("jelly shadow frog dirt dragon use armed praise universe win jungle close inmate rain oil canvas beauty pioneer chef soccer icon dizzy thunder meadow", { prefix: "sei" }));
  wallets.push(await DirectSecp256k1HdWallet.fromMnemonic("chair love bleak wonder skirt permit say assist aunt credit roast size obtain minute throw sand usual age smart exact enough room shadow charge", { prefix: "sei" }));
  wallets.push(await DirectSecp256k1HdWallet.fromMnemonic("word twist toast cloth movie predict advance crumble escape whale sail such angry muffin balcony keen move employ cook valve hurt glimpse breeze brick", { prefix: "sei" }));

  return wallets;
}

export async function storeAndInitContract(client: SigningCosmWasmClient, sender: string, contractPath: string, initMsg: any, label: string, funds?: Coin[]): Promise<string> {
  const bytecode = fs.readFileSync(contractPath) as Uint8Array;
  const storeTx = await client.upload(sender, bytecode, fee);
  const instantiate = await client.instantiate(sender, storeTx.codeId, initMsg, label, fee, { funds });

  return instantiate.contractAddress;
}


export async function requestFaucetTokensConstantine(address: string, coin: string): Promise<boolean> {
  const response = await axios.post("https://faucet.constantine.archway.tech/", {
    address,
    coins: [
      coin
    ]
  });

  return response.status == 200;
}