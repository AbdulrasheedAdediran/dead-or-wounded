import { useState } from "react";
import "./Navbar.css";
import Connected from "./Connected";
import dowWhite from "../assets/dowWhite.png";
import walletIcon from "../assets/wallet-icon.png";
import Dashboard from "../container/StartGame/Dashboard";

const Navbar = ({
  connectWallet,
  connected,
  walletAddress,
  userBalance,
  disconnectWallet,
  playerStatistics,
  claimFreeTokens,
}) => {
  const [viewDashboard, setViewScoreboard] = useState(false);

  const toggleDashboard = () => {
    setViewScoreboard(!viewDashboard);
    console.log("Toggled dashboard");
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
      <div className={`dashboard-overlay ${viewDashboard ? "view" : ""}`}></div>
      <div className={`dashboard-container ${viewDashboard ? "view" : ""}`}>
        <Dashboard
          played={playerStatistics.gamesPlayed}
          won={playerStatistics.gamesWon}
          lost={playerStatistics.gamesLost}
          currentStreak={playerStatistics.currentWinStreak}
          highestStreak={playerStatistics.highestWinStreak}
          DOWTokenBalance={userBalance.DOWTokenBalance}
          networkCoinBalance={userBalance.networkCoinBalance}
          claimFreeTokens={claimFreeTokens}
          disconnectWallet={disconnectWallet}
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
            <button className="menu-container" onClick={toggleDashboard}>
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
