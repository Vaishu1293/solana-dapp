const anchor = require('@project-serum/anchor');

const main = async () => {
  console.log("Starting tests...");

  // Use the correct provider
  // const provider = anchor.AnchorProvider.local();
  // anchor.setProvider(provider);
  anchor.setProvider(anchor.Provider.env());

  // Ensure the workspace loads correctly
  console.log("Workspace:", anchor.workspace);

  // Reference the program correctly
  const program = anchor.workspace.gifportal; // Note: Lowercase `gifportal`, as defined in Anchor.toml

  // Check if program exists before calling RPC
  if (!program) {
    throw new Error("Anchor workspace failed to load the program. Check Anchor.toml.");
  }

  // Call the RPC function
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
