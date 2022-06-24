import { React } from "react";
import "./Attempts.css";

const Attempts = (props) => {
  const maxTrials = 7;

  return (
    <section className="attempts">
      <h2>Scoreboard</h2>
      <table>
        <thead>
          <tr>
            <th className="table__trial">Trial</th>
            <th className="table__attempt">Attempt</th>
            <th className="table__score score">Score</th>
          </tr>
        </thead>
        <tbody className="table-row.flicker">
          {props.roundScores.map((roundScore) => (
            <tr key={roundScore.trial}>
              <td className="table__trial table-row.flicker">
                {roundScore.trial}/{maxTrials}
              </td>
              <td className="table__attempt table-row.flicker">
                {roundScore.attempt.join(" ")}
              </td>
              <td className="table__score table-row.flicker">
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
