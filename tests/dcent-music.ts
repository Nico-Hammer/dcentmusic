import * as dotenv from 'dotenv'
dotenv.config();
import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { DcentMusic } from "../target/types/dcent_music";
import { Keypair } from "@solana/web3.js";
import assert from "assert";
 
describe("dcent_music", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = provider.wallet as anchor.Wallet;
  const program = anchor.workspace.dcent_music as Program<DcentMusic>;
 
  it("initialize", async () => {
    // Generate keypair for the new account
    const newAccountKp = new Keypair();
 
    // Send transaction
    const data = new BN(42);


    const transactionSignature = await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: wallet.publicKey,
      })
      .signers([newAccountKp])
      .rpc();
 
    // Fetch the created account
    const newAccount = await program.account.newAccount.fetch(
      newAccountKp.publicKey,
    );
 
    console.log("Transaction signature: ", transactionSignature);
    console.log("On-chain data is:", newAccount.data.toString());
    assert(data.eq(newAccount.data));
  });
});