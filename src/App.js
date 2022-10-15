import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { web3 } from "@project-serum/anchor";

import twitterLogo from "./assets/twitter-logo.svg";
import "./App.css";

import { gifListState, walletAddressState } from "./atoms/atoms";
import { baseAccount, getProgram, getProvider } from "./utils/utils";
import { TWITTER_HANDLE, TWITTER_LINK } from "./utils/constants";

import NotConnectedContainer from "./components/NotConnectedContainer";
import ConnectedContainer from "./components/ConnectedContainer";

// SystemProgram is a reference to the Solana runtime
const { SystemProgram } = web3;

const App = () => {
  const [loading, setLoading] = useState(true);
  const [gifLoading, setGifLoading] = useState(false);

  const [walletAddress, setWalletAddress] = useRecoilState(walletAddressState);
  const [gifList, setGifList] = useRecoilState(gifListState);

  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = await getProgram();
      const { publicKey: baseAccountPubkey } = baseAccount;

      await program.methods
        .startStuffOff()
        .accounts({
          baseAccount: baseAccountPubkey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([baseAccount])
        .rpc();

      console.log(
        "Created a new BaseAccount w/ address:",
        baseAccountPubkey.toString()
      );
      await getGifList();
    } catch (err) {
      console.error("Error creating BaseAccount account:", err);
    }
  };

  const getGifList = async () => {
    try {
      setGifLoading(true);
      const program = await getProgram();
      const account = await program.account.baseAccount.fetch(
        baseAccount.publicKey
      );
      console.log("Got the account", account);
      setGifList(account.gifList);
    } catch (err) {
      console.error("Error retrieving Gif List:", err);
      setGifList(null);
    } finally {
      setLoading(false);
      setGifLoading(false);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (window?.solana?.isPhantom) {
        console.log("Phanton wallet found!");
        const response = await window.solana.connect({ onlyIfTrusted: true });
        const publicKey = response.publicKey.toString();
        console.log("Connected with Public Key:", publicKey);
        setWalletAddress(publicKey);
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const connectWallet = async () => {
    try {
      const { solana } = window;
      if (solana) {
        const response = await solana.connect();
        const publicKey = response.publicKey.toString();
        console.log("Connected with Public Key:", publicKey);
        setWalletAddress(publicKey);
      }
    } catch (err) {
      console.error("Error connecting to wallet:", err);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      console.log("Fetching GIF list...");
      getGifList();
    }
  }, [walletAddress]);

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  const renderBody = () => {
    if (loading || gifLoading) {
      return <div>Loading...</div>;
    }

    if (gifList === null) {
      setLoading(false);
      return (
        <div className="connected-container">
          <button
            className="cta-button submit-gif-button"
            onClick={createGifAccount}
          >
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      );
    }

    if (!walletAddress) {
      return <NotConnectedContainer connectWallet={connectWallet} />;
    }
    return <ConnectedContainer getGifList={getGifList} />;
  };

  return (
    <div className="App">
      <div className={walletAddress ? "authed-container" : "container"}>
        <div className="header-container">
          <p className="header">🖼 GIF Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {renderBody()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
