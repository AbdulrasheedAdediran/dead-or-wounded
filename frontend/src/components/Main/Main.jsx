import { React, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sound from "../container/Sound/Sound";
import charshoeX from "../assets/Charshoe-X.mp3";
import "./Main.css";

const Main = ({ connected, claimFreeTokens, userBalance, isPlaying }) => {
  const [isDisabled, setIsDisabled] = useState(false);
  useEffect(() => {
    if (!connected && parseInt(userBalance.DOWTokenBalance) < 5) {
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected]);

  return (
    <main>
      <div className="dow-text">
        <div className="dow-text-border" />
        <h1 className="dead-text">Dead</h1>
        <p className="dow-text-or">or</p>
        <h1>Wounded</h1>
        <div className="dow-text-border" />
      </div>
      <button
        className="claim-dow-button"
        onClick={claimFreeTokens}
        disabled={isDisabled}
      >
        Claim DOW Tokens
      </button>
      <div className="main-menu-links">
        <Link to="/startGame">
          <button
            className="menu-button start-game"
            disabled={isDisabled}
            // onClick={startGame}
          >
            <Sound isPlaying={isPlaying} url={charshoeX} />
            Start Game
          </button>
        </Link>
        <Link to="/howToPlay">
          <button className="menu-button">How to Play</button>
        </Link>
        <Link to="/options">
          <button className="menu-button">Options</button>
        </Link>
        <Link to="/about">
          <button className="menu-button">About</button>
        </Link>
      </div>
    </main>
  );
};

export default Main;
