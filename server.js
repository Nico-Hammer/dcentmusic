const express = require('express');
const bodyParser = require('body-parser');
const { Connection, Keypair, PublicKey, Transaction, SystemProgram } = require('@solana/web3.js');
const { BN } = require('bn.js');
const anchor = require('@project-serum/anchor');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

async function initializeProgram() {
  // Set up connection to the localnet
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  // Load wallet from file
  const walletJson = JSON.parse(fs.readFileSync('/home/void/.config/solana/id.json'));
  const keypair = Keypair.fromSecretKey(Uint8Array.from(walletJson));

  // Create wallet that signs with the fee payer keypair
  const wallet = {
    publicKey: keypair.publicKey,
    signTransaction: async (tx) => {
      // Sign the transaction with the fee payer keypair
      tx.partialSign(keypair);
      return tx;
    },
    signAllTransactions: async (txs) => {
      for (const tx of txs) tx.partialSign(keypair);
      return txs;
    },
  };

  // Program ID
  const programID = new PublicKey("FoifQqF6jRL6nzfkF7EpWsjTEdfA4cHx7ikb5zraMq1V");

  // Load the IDL file
  const idlPath = path.join(__dirname, 'target', 'idl', 'dcent_music.json');
  const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));

  // Set up Anchor provider
  const provider = new anchor.AnchorProvider(connection, wallet, { 
    commitment: 'confirmed',
    preflightCommitment: 'processed'
  });
  anchor.setProvider(provider);

  // Create program instance
  const program = new anchor.Program(idl, programID, provider);

  return { program, provider, connection, keypair };
}

let programState;

// Initialize program on startup
initializeProgram().then(state => {
  programState = state;
  console.log('Program initialized successfully');
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize program:', err);
  process.exit(1);
});

app.post('/initialize', async (req, res) => {
  try {
    const { data, input } = req.body;
    console.log('Received request:', { data, input });

    if (!programState) {
      return res.status(500).json({ error: 'Program not initialized' });
    }

    const { program, connection, keypair: feePayerKeypair } = programState;

    // Create a new account keypair
    const newAccountKp = new Keypair();
    console.log('New account public key:', newAccountKp.publicKey.toString());

    // Manual construction of the instruction to avoid Anchor's signer mismatch.
    // Build instruction data: 8-byte discriminator + borsh-encoded args (u64, string)
    const ixDef = program.idl.instructions.find(i => i.name === 'initialize');
    if (!ixDef) throw new Error('initialize instruction not found in IDL');
    const disc = Buffer.from(ixDef.discriminator);

    // Encode u64 (little-endian) and string (u32 length + bytes)
    const dataBuf = new BN(data).toArrayLike(Buffer, 'le', 8);
    const inputBuf = Buffer.from(input, 'utf8');
    const inputLenBuf = Buffer.alloc(4);
    inputLenBuf.writeUInt32LE(inputBuf.length, 0);

    const ixData = Buffer.concat([disc, dataBuf, inputLenBuf, inputBuf]);

    const initializeIx = new anchor.web3.TransactionInstruction({
      programId: program.programId,
      keys: [
        { pubkey: newAccountKp.publicKey, isSigner: true, isWritable: true },
        { pubkey: feePayerKeypair.publicKey, isSigner: true, isWritable: true },
        { pubkey: anchor.web3.SystemProgram.programId, isSigner: false, isWritable: false },
      ],
      data: ixData,
    });

    const txn = new anchor.web3.Transaction().add(initializeIx);

    // Set recent blockhash and fee payer
    const { blockhash } = await connection.getLatestBlockhash();
    txn.recentBlockhash = blockhash;
    txn.feePayer = feePayerKeypair.publicKey;

    // Sign with both fee payer and new account
    txn.partialSign(feePayerKeypair, newAccountKp);

    const raw = txn.serialize();
    const signature = await connection.sendRawTransaction(raw, { skipPreflight: false, preflightCommitment: 'confirmed' });

    console.log('Transaction signature:', signature);

    // Wait for confirmation
    await connection.confirmTransaction(signature, 'confirmed');
    console.log('Transaction confirmed');

    // Fetch the newly created account
    const newAccount = await program.account.newAccount.fetch(newAccountKp.publicKey);
    console.log('Account fetched:', newAccount);

    // Send successful response
    res.json({
      signature: signature,
      data: newAccount.data.toString(),
      input: newAccount.input,
    });
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: error.message });
  }
});