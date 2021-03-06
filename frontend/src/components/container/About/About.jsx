import React from "react";
import "./About.css";
import { Link } from "react-router-dom";
// import Layout from "../../Layout";

const About = () => {
  return (
    <section className="page about">
      <div>
        <h1>About</h1>
        <p>
          Dead or Wounded (DOW) is a play-to-earn decentralised game where
          players can earn DOW tokens (Dead or Wounded DApp native token). Early
          adopters are rewarded with 50 free DOW tokens to interact with the
          DApp as players are required to spend DOW tokens to access the game.
        </p>
        <p>
          Players stand a chance to win more DOW tokens for each round they win.
          The amount of token a player wins will be determined by their
          performance in the game.
        </p>
        <p>
          Dead or Wounded is beginner friendly and does not require players to
          have any technical knowledge as it seeks to improve adoption of Web3
          and give users the opportunity to earn while having fun.
        </p>
      </div>
      <Link to="/" className="button">
        <button>Back</button>
      </Link>
    </section>
  );
};

export default About;
