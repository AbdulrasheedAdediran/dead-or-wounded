import { useState, useEffect } from "react";
import "./Navbar.css";
import Connected from "./Connected";
import dowWhite from "../assets/dowWhite.png";
import walletIcon from "../assets/wallet-icon.png";
import Dashboard from "./Dashboard";

const Navbar = ({
  connectWallet,
  connected,
  walletAddress,
  userBalance,
  disconnectWallet,
  playerStatistics,
  claimFreeTokens,
  claimed
}) => {
  const [viewDashboard, setViewScoreboard] = useState(false);

   const claimfree = async () => {
    await claimFreeTokens()
  }

  const toggleDashboard = () => {
    setViewScoreboard(!viewDashboard);
  };
  return (
    <nav>
      <div className="logo">
        <a href="./">
          <img className="dow-logo" src={dowWhite} alt={"DOW Logo"} />
        </a>
      </div>
      {/* <div className="desktop-disconnect-wallet">
        {connected && (
          <button className="btn-connect-wallet" onClick={disconnectWallet}>
            Disconnect Wallet
          </button>
        )}
      </div> */}
      <div onClick={toggleDashboard}  className={`dashboard-overlay ${viewDashboard ? "view" : ""}`}></div>
      <div className={`dashboard-container ${viewDashboard ? "view" : ""}`}>
        <Dashboard
          stats={playerStatistics}
          claimfree={claimfree}
          DOWTokenBalance={userBalance.DOWTokenBalance}
          networkCoinBalance={userBalance.networkCoinBalance}
          disconnectWallet={disconnectWallet}
          toggleDashboard={toggleDashboard}
          claimed={claimed}
        />
      </div>
      <div className="user-info">
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
        <div className="menu-icon">
          {connected && (
            <button
              className="menu-container"
              onClick={() => {
                toggleDashboard();
              }}
            >
              <div className="menu-circle">
                <div className="circle-bar">
                  <span className="small-circle"></span>
                  <span className="bar"></span>
                </div>
                <div className="circle-bar">
                  <span className="small-circle"></span>
                  <span className="bar"></span>
                </div>
                <div className="circle-bar">
                  <span className="small-circle"></span>
                  <span className="bar"></span>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
