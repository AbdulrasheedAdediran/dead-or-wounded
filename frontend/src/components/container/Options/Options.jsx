import React, { useState, useEffect } from "react";
import "./Options.css";
import { Link } from "react-router-dom";
import Switch from "../../Switch/Switch";
import Sound from "../Sound/Sound";

const Options = () => {
  const [secondValue, setSecondValue] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  useEffect(() => {}, [isPlaying]);
  return (
    <div className="options">
      <h1>Options</h1>
      <div className="music-sound">
        <div className="div_flex">
          <p>Music</p>
          <Switch
            isOn={isPlaying}
            onColor="hsla(111, 97%, 49%, 0.75)"
            handleToggle={() => setIsPlaying(!isPlaying)}
          />
          {!isPlaying ? "Off" : "On"}
        </div>
        <Sound isPlaying={isPlaying} />
        <div className="div_flex">
          <p>Sound Effects</p>
          <Switch
            className="switch"
            isOn={secondValue}
            onColor="hsla(111, 97%, 49%, 0.75)"
            handleToggle={() => setSecondValue(!secondValue)}
          />
        </div>
      </div>
      <Link to="/">
        <button className="button">Back</button>
      </Link>
    </div>
  );
};

export default Options;
