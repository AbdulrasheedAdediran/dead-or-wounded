import { React } from "react";
import "./Navbar.css";
import Connected from "./Connected";
import dowWhite from "../assets/dowWhite.png";
import walletIcon from "../assets/wallet-icon.png";

const Navbar = ({
  connectWallet,
  connected,
  walletAddress,
  userBalance,
  disconnectWallet,
}) => {
  return (
    <nav>
      <div className="logo">
        <a href="./">
          <img className="dow-logo" src={dowWhite} alt={"DOW Logo"} />
        </a>
      </div>
      <div className="desktop-disconnect-wallet">
        {connected && (
          <button className="btn-connect-wallet" onClick={disconnectWallet}>
            Disconnect Wallet
          </button>
        )}
      </div>
      <div className="desktop-connect-wallet">
        {connected ? (
          <Connected
            DOWTokenBalance={userBalance.DOWTokenBalance}
            networkCoinBalance={userBalance.networkCoinBalance}
            address={walletAddress}
          />
        ) : (
          <button className="btn-connect-wallet" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
      </div>
      <div className="mobile-wallet-icon">
        {connected ? (
          <Connected address={walletAddress} />
        ) : (
          <div className="wallet-icon" onClick={connectWallet}>
            <img src={walletIcon} alt={"Wallet Icon"} />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
