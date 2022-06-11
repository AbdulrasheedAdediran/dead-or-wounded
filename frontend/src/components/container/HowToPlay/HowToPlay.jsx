import React from "react";
import "./HowToPlay.css";
import { Link } from "react-router-dom";
import Layout from "../../Layout";

const HowToPlay = () => {
  return (
    <div className="howToPlay">
      <h1>How To Play</h1>
      <ul>
        <li>
          There are four unique random numbers for each game. The goal is to
          guess the correct number and correct position of all four numbers.
        </li>
        <li>
          Enter four unique numbers and click Play or hit Enter on your keyboard
          to submit. Each attempt you make will be recorded to inform your next
          trial.
        </li>
        <li></li>
        <li>
          A number is considered to be wounded if it is part of the sequence but
          in the wrong position.
        </li>
        <li>
          A number is considered to be dead if it is part of the sequence and
          you got the position right.
        </li>
        <li>
          You have to get all numbers correctly in 7 trials or less to win.
        </li>
      </ul>

      <Link to="/" className="button">
        <button>Got It</button>
      </Link>
    </div>
  );
};

export default HowToPlay;
