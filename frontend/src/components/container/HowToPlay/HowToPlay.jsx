import React from "react";
import "./HowToPlay.css";
import { Link } from "react-router-dom";

const HowToPlay = () => {
  return (
    <section className="page howToPlay">
      <div>
        <h1>How To Play</h1>
        <p>
          A set of four unique random numbers are generated for each game. The
          goal is to guess the numbers and positions of the generated set
          correctly.
        </p>
        <p>
          Enter four numbers by clicking the buttons on your screen then click
          Play to submit. Each attempt you make will be recorded to inform your
          next trial.
        </p>
        <p>
          A number is dead if it is part of the generated set and in the right
          position and wounded if it is part of the generated set but in the
          wrong position.
        </p>
        <p>
          You have to guess all four numbers and positions of the generated set
          correctly in 7 trials or less to win and get rewarded with $DOW
          tokens.
        </p>
      </div>

      <Link to="/" className="button">
        <button>Got It</button>
      </Link>
    </section>
  );
};

export default HowToPlay;
