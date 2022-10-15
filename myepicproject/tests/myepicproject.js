// const anchor = require("@project-serum/anchor");

// describe("myepicproject", () => {
//   // Configure the client to use the local cluster.
//   anchor.setProvider(anchor.AnchorProvider.env());

//   it("Is initialized!", async () => {
//     // Add your test here.
//     const program = anchor.workspace.Myepicproject;
//     const tx = await program.methods.initialize().rpc();
//     console.log("Your transaction signature", tx);
//   });
// });
const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

const main = async () => {
  console.log("🚀 Starting test...");

  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Myepicproject;

  const baseAccount = anchor.web3.Keypair.generate();

  const tx = await program.methods
    .startStuffOff()
    .accounts({
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([baseAccount])
    .rpc();

  console.log("📝 Your transaction signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 GIF Count", account.totalGifs.toString());

  await program.methods
    .addGif("insert_a_giphy_link_here")
    .accounts({
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    })
    .rpc();

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("👀 GIF Count", account.totalGifs.toString());
  // Access gif_list on the account!
  console.log("👀 GIF List", account.gifList);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
