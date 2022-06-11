import { React } from "react";
import "./Navbar.css";
import Connected from "./Connected";
import dowWhite from "../assets/dowWhite.png";

const Navbar = ({ connectWallet, connected, walletAddress, userBalance }) => {
  return (
    <nav>
      <div className="logo">
        <a href="./">
          <img className="dow-logo" src={dowWhite} alt={"DOW Logo"} />
        </a>
      </div>

      <div>
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
    </nav>
  );
};

export default Navbar;
