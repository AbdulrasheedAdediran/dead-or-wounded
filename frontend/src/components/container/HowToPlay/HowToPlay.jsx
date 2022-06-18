import React from "react";
import "./HowToPlay.css";
import { Link } from "react-router-dom";

const HowToPlay = () => {
  return (
    <div className="howToPlay">
      <h1>How To Play</h1>
      <ul>
        <li>
          There are four unique random numbers for each game. Enter four unique
          numbers and click Play or hit Enter on your keyboard to submit
        </li>
        <li>
          The goal is to guess all four numbers and their positions correctly.
          Each attempt you make will be recorded to inform your next trial.
        </li>
        <li>
          A number is dead if it is part of the sequence and in the right
          position and wounded if it is part of the sequence but in the wrong
          position.
        </li>
        <li>
          You have to get all numbers and their positions correctly in 7 trials
          or less to win and get rewarded with $DOW tokens.
        </li>
      </ul>

      <Link to="/" className="button">
        <button>Got It</button>
      </Link>
    </div>
  );
};

export default HowToPlay;
