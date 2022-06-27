import { React } from "react";
import "./Scoreboard.css";

const Attempts = (props) => {
  const maxTrials = 7;

  return (
    <section className="scoreboard">
      <h2>Scoreboard</h2>
      <table>
        <thead>
          <tr className={`table-row ${props.flicker ? "flicker" : ""}`}>
            <th className="table__trial">Trial</th>
            <th className="table__attempt">Attempt</th>
            <th className="table__score score">Score</th>
          </tr>
        </thead>
        <tbody>
          {props.roundScores.map((roundScore) => (
            <tr key={roundScore.trial}>
              <td className="table__trial">
                {roundScore.trial}/{maxTrials}
              </td>
              <td className="table__attempt">{roundScore.attempt.join(" ")}</td>
              <td className="table__score">
                <span>{roundScore.dead} Dead</span>{" "}
                <span className="hyphen">-</span>
                <span> {roundScore.wounded} Wounded</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Attempts;
