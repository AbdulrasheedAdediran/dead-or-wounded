import React from "react";
import "./Dashboard.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Dashboard = (
  stats,
  tokenBalance,
  coinBalance,
  claimfree,
  connected,
  disconnectWallet
) => {
  let playerStats = stats.stats;
  let percentage = (playerStats.gamesWon / playerStats.gamesPlayed) * 100;
  let winRate = Math.round(percentage) || 0;
  // console.log(stats)
  return (
    <section className="dashboard">
      <h2>Dashboard</h2>
      <div className="dashboard-wrapper">
        <h3>Statistics</h3>
        <div className="statistics">
          <div className="game-statistics">
            <div className="played-won-lost-streak">
              <div className="game-stats played">
                <div>Games Played</div>
                <div>{playerStats.gamesPlayed || 0}</div>
              </div>
              <div className="game-stats won">
                <div>Games Won</div>
                <div>{playerStats.gamesWon || 0}</div>
              </div>
              <div className="game-stats lost">
                <div>Games Lost</div>
                <div>{playerStats.gamesLost || 0}</div>
              </div>
              {/* <div className="streak-stats"> */}
              <div className="game-stats max-streak">
                <div>Max Streak</div>
                <div>{playerStats.highestWinStreak || 0}</div>
              </div>
              <div className="game-stats current-streak">
                <div>Current Streak</div>
                <div>{playerStats.currentWinStreak || 0}</div>
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
        <h3>Assets</h3>
        <div className="userAssets">
          <div className="assets">
            {parseFloat(stats.coinBalance).toFixed(2) || 0} MATIC
          </div>
          <div className="assets">
            {parseFloat(stats.tokenBalance).toFixed(2) || 0} DOW
          </div>
        </div>
        {/* <br />
        <div className="dashboard-btn">
          {!stats.claimed ? (
            <button onClick={stats.claimfree} className="claim-dow btn">
              Claim Free DOW
            </button>
          ) : (
            ""
          )}
          <button
            onClick={() => {
              stats.disconnectWallet();
              stats.toggleDashboard();
            }}
            className="disconnect btn"
          >
            Disconnect
          </button>
        </div> */}
      </div>
      <div className="dashboard-btn">
        <button
          onClick={() => {
            stats.disconnectWallet();
            stats.toggleDashboard();
          }}
          className="disconnect btn"
        >
          Disconnect
        </button>
        {!stats.claimed ? (
          <button onClick={stats.claimfree} className="claim-dow btn">
            Claim Free DOW
          </button>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

export default Dashboard;
