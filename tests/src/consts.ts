import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { getGenesisWallet, getSeiConnection, QueryClient } from "./utils/sei";
import 'dotenv/config';
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { SigningStargateClient } from '@cosmjs/stargate';

export class TestConsts {

    // You can keep your contract addresses here for easy access
    public contract = "<CONTRACT_ADDREESS>";

    public queryClient: QueryClient;
    public cosmWasmClient: SigningCosmWasmClient;
    public stargateClient: SigningStargateClient;

    public signerAddress: string;
    public nativeDenom: string;

    async initClients() {
        const [wallet] = await getGenesisWallet();
        const { queryClient, cosmWasmClient, stargateClient, defaultAddress } = await getSeiConnection(wallet);
        this.queryClient = queryClient;
        this.cosmWasmClient = cosmWasmClient;
        this.stargateClient = stargateClient;
        this.signerAddress = defaultAddress;
        this.nativeDenom = "usei";
    }
}