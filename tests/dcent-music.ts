import * as dotenv from 'dotenv';
dotenv.config();  // Ensure this is at the top, before any other imports

import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { DcentMusic } from "../target/types/dcent_music";

describe("dcent-music", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.dcentMusic as Program<DcentMusic>;

  it("Is initialized!", async () => {
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
