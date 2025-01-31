const anchor = require('@project-serum/anchor');
const { AnchorProvider, web3 } = anchor;
const fs = require('fs');
const path = require('path');

const main = async () => {
  console.log("Starting tests...");

  // Use the correct provider
  const provider = AnchorProvider.env(); // Use env() for environment-based provider
  anchor.setProvider(provider);

  console.log("Workspace Programs:", Object.keys(anchor.workspace));

  // Manually load the IDL
  const idlPath = path.join(__dirname, "../target/idl/gifportal.json");
  if (!fs.existsSync(idlPath)) {
    throw new Error(`IDL not found at: ${idlPath}. Run 'anchor build' again.`);
  }
  console.log("IDL Found:", idlPath);

  // Load the IDL manually
  const idl = require(idlPath);
  const programId = new web3.PublicKey("GWXJMUTKETCdfGMYN7dgXAtu3831oaxLNz95u4risCfQ");

  // Create the program instance
  const program = new anchor.Program(idl, programId, provider);
  console.log("Manually Loaded Program ID:", program.programId.toString());

  // Call an RPC function
  const tx = await program.rpc.startStuffOff();
  console.log("Your transaction signature: ", tx);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error("Error running script:", error);
    process.exit(1);
  }
};

runMain();