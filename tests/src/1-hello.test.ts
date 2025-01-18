import * as fs from "fs";
import { TestConsts } from "./consts";
import { Coin, DirectSecp256k1HdWallet, DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import { getGenesisWallet, getJunoConnection, storeAndInitContract } from "./utils/juno";
import { expect } from "chai";
import { Ed25519, Ed25519Keypair, Random, keccak256 } from "@cosmjs/crypto";
import { fromBinary } from "@cosmjs/cosmwasm-stargate";
try {
describe('Warp Junø Project', () => {
    const consts = new TestConsts();
    const fee = { amount: [{ amount: "1000000", denom: "usei" }], gas: "30000000" };

    before(async () => {
        await consts.initClients();
    });

    it('checks if the chain is up and running', async () => {
        let chainId = await consts.stargateClient.getChainId();
        expect(chainId).to.be.eq("sei");
    });

    it('checks the current balance of the genesis wallet', async () => {
        const balance = await consts.stargateClient.getBalance(consts.signerAddress, consts.nativeDenom);
        const amount = BigInt(balance.amount);
        expect(amount).to.be.gte(0);
    });
});

} catch (e) {
    console.error(`Caught: ${e}`);
}