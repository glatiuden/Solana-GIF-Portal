/*
 * We want to render this UI when the user hasn't connected
 * their wallet to our app yet.
 */
const NotConnectedContainer = ({ connectWallet }) => (
  <button className="cta-button connect-wallet-button" onClick={connectWallet}>
    Connect to Wallet
  </button>
);

export default NotConnectedContainer;
