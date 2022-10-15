import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, AnchorProvider, web3 } from "@project-serum/anchor";
import kp from "./keypair.json";

const { Keypair } = web3;

const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = Keypair.fromSecretKey(secret);

// This is the address of your solana program, if you forgot, just run solana address -k target/deploy/myepicproject-keypair.json
const programID = new PublicKey("4EiyQgFytzpGwQzKM5bn9AW6aWVuKChYzLL9bjZkfoow");

// Set our network to devnet.
const network = clusterApiUrl("devnet");

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed",
};

/**
 * Establish a connection & AnchorProvider
 * @returns {AnchorProvider} provider
 */
const getProvider = () => {
  const { solana } = window;
  const connection = new Connection(network, opts.preflightCommitment);
  const provider = new AnchorProvider(
    connection,
    solana,
    opts.preflightCommitment
  );
  return provider;
};

const getProgram = async () => {
  const provider = getProvider();
  // Get metadata about your solana program
  const idl = await Program.fetchIdl(programID, provider);
  // Create a program that you can call
  return new Program(idl, programID, provider);
};

export { baseAccount, getProvider, getProgram };
