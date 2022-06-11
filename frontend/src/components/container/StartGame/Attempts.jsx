import { React } from "react";
import "./Attempts.css";

const Attempts = (props) => {
  const maxTrials = 7;

  return (
    <section className="attempts">
      <h2>Attempts</h2>
      <table>
        <thead>
          <tr>
            <th className="table__trial">Trial</th>
            <th className="table__attempt">Attempt</th>
            <th className="table__score">Score</th>
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
                {roundScore.dead} Dead - {roundScore.wounded} Wounded
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default Attempts;
