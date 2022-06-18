import React, { useState, useEffect } from "react";
import "./Options.css";
import { Link } from "react-router-dom";
import Switch from "../../Switch/Switch";
import Sound from "../Sound/Sound";

const Options = () => {
  const [secondValue, setSecondValue] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEffect, setSoundEffect] = useState(false);
  useEffect(() => {}, [isPlaying]);
  return (
    <div className="options">
      <h1>Options</h1>
      <div className="music-sound">
        <div className="grid-column">
          <div className="div_flex">
            <div>
              <p>Music</p>
            </div>
            <div className="div_flex">
              <Switch
                isOn={isPlaying}
                onColor="hsla(111, 97%, 49%, 0.75)"
                handleToggle={() => setIsPlaying(!isPlaying)}
              />
              {!isPlaying ? "Off" : "On"}
            </div>
          </div>
          <div className="div_flex">
            <p>Sound Effects</p>
            <Switch
              className="switch"
              isOn={soundEffect}
              onColor="hsla(111, 97%, 49%, 0.75)"
              handleToggle={() => setSoundEffect(!soundEffect)}
            />
            {!soundEffect ? "Off" : "On"}
          </div>
        </div>
      </div>
      <Sound isPlaying={isPlaying} />
      <Link to="/">
        <button className="button">Back</button>
      </Link>
    </div>
  );
};

export default Options;
