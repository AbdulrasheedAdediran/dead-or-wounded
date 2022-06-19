import React  from "react";
import "./Dashboard.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Dashboard = (
  stats,
  connected,
  // walletAddress,
  // DOWTokenBalance,
  // networkCoinBalance,
  disconnectWallet,
  freeTokens
) => {
  let percentage = (stats.won / stats.played) * 100;
  let winRate = Math.round(percentage) || 0;

  return (
    <section className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-wrapper">
        <h3>Game Stats</h3>
        <div className="statistics">
          <div className="win-rate-and-game-stats">
            <div className="played-won-lost-streak">
              <div className="game-stats played">
                <div>Played</div>
                <div>{stats.played || 0}</div>
              </div>
              <div className="game-stats won">
                <div>Won</div>
                <div>{stats.won || 0}</div>
              </div>
              <div className="game-stats lost">
                <div>Lost</div>
                <div>{stats.lost || 0}</div>
              </div>
              {/* <div className="streak-stats"> */}
              <div className="game-stats current-streak">
                <div>Current Win Streak</div>
                <div>{stats.currentStreak || 0}</div>
              </div>
              <div className="game-stats max-streak">
                <div>Max Win Streak</div>
                <div>{stats.highestStreak || 0}</div>
              </div>
              {/* </div> */}
            </div>
          </div>
          <div className="win-rate">
            {/* <p>Win Rate</p>
            <p>{winRate}%</p> */}
            <p>Win Rate</p>
            <CircularProgressbar
              className="progressBar"
              // valueStart={0}
              // valueEnd={winRate}
              // duration={1.4}
              // easingFunction={easeQuadInOut}
              value={winRate}
              text={`${winRate}%`}
              styles={buildStyles({
                // Rotation of path and trail, in number of turns (0-1)
                rotation: 0,

                // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                strokeLinecap: "round",

                // Text size
                textSize: "1rem",

                // How long animation takes to go from one percentage to another, in seconds
                pathTransitionDuration: 0.5,

                // Can specify path transition in more detail, or remove it entirely
                // pathTransition: 'none',

                // Colors
                pathColor: `hsla(111, 97%, 49%, 0.75), ${winRate / 100})`,
                textColor: "hsl(35, 80%, 90%)",
                trailColor: "hsl(35, 80%, 90%)",
                backgroundColor: "#333",
                opacity: "0.85",
              })}
            />
          </div>
        </div>
        {/* <h3>Assets</h3>
        <div>
          <div className="assets">
            {parseFloat(networkCoinBalance).toFixed(2) || 0} MATIC
          </div>
          <div className="assets">
            {parseFloat(DOWTokenBalance).toFixed(2) || 0} DOW
          </div>
        </div> */}
        <div className="dashboard-btn">
          <button onClick={() => freeTokens()} className="claim-dow btn">
            Claim DOW
          </button>
          <button onClick={disconnectWallet} className="disconnect btn">
            Disconnect
          </button>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
