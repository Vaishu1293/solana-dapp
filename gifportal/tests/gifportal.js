const anchor = require('@coral-xyz/anchor');
const { Connection, Keypair, PublicKey, SystemProgram } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const main = async () => {
  console.log("Starting tests...");

  // ✅ Load the Solana Keypair (Ensure you have a funded wallet)
  const WALLET_PATH = process.env.WALLET_PATH || "/root/.config/solana/id.json";
  if (!fs.existsSync(WALLET_PATH)) {
    throw new Error(`Wallet file not found: ${WALLET_PATH}`);
  }
  const walletKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync(WALLET_PATH, 'utf-8')))
  );

  // ✅ Set Up Connection
  const connection = new Connection("https://api.devnet.solana.com", "confirmed");

  // ✅ Create a Custom Provider
  const wallet = new anchor.Wallet(walletKeypair);
  const provider = new anchor.AnchorProvider(connection, wallet, {
    preflightCommitment: "processed",
  });

  anchor.setProvider(provider);

  // ✅ Manually Load IDL
  const idlPath = path.join(__dirname, "../target/idl/gifportal.json");
  if (!fs.existsSync(idlPath)) {
    throw new Error(`IDL not found at: ${idlPath}. Run 'anchor build' again.`);
  }
  console.log("IDL Found:", idlPath);

  const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
  const programId = new PublicKey(idl.address);
  const program = new anchor.Program(idl, programId, provider);

  console.log("Manually Loaded Program ID:", program.programId.toString());

  const baseAccount = anchor.web3.Keypair.generate();

  // ✅ Execute Transaction with Explicit Provider
  try {
    const tx = await program.methods
      .startStuffOff()
      .accounts({
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([baseAccount])
      .rpc();

    console.log("Your transaction signature: ", tx);
  } catch (err) {
    console.error("🚨 RPC Transaction Error:", err);
  }
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error("🚨 Error running script:", error);
    process.exit(1);
  }
};

runMain();
