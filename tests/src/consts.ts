import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { getGenesisWallet, getJunoConnection } from "./utils/juno";
import 'dotenv/config';
import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { StargateClient, SigningStargateClient, QueryClient } from '@cosmjs/stargate';

export class TestConsts {

    // You can keep your contract addresses here for easy access
    public contract = "<CONTRACT_ADDREESS>";

    public cosmWasmClient: SigningCosmWasmClient;
    public stargateClient: SigningStargateClient;

    public signerAddress: string;
    public nativeDenom: string;

    async initClients() {
        const wallet = await getGenesisWallet();
        const { cosmWasmClient, stargateClient, defaultAddress } = await getJunoConnection(wallet);
        
        this.cosmWasmClient = cosmWasmClient;
        this.stargateClient = stargateClient;
        this.signerAddress = defaultAddress;
        this.nativeDenom = "ujunox";
    }
}