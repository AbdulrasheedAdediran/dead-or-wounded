import React, { useState, useEffect } from "react";
import "./Options.css";
import { Link } from "react-router-dom";
import Switch from "../../Switch/Switch";
import Sound from "../Sound/Sound";

const Options = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundEffect, setSoundEffect] = useState(false);
  useEffect(() => {}, [isPlaying]);
  return (
    <section className="page options">
      <div>
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
                  onColor="var(--sky-blue-black-gradient)"
                  handleToggle={() => setIsPlaying(!isPlaying)}
                />
                {!isPlaying ? "Off" : "On"}
              </div>
            </div>
            <div className="div_flex">
              <div>
                <p>Sound FX</p>
              </div>
              <div className="div_flex">
                <Switch
                  className="switch"
                  isOn={soundEffect}
                  onColor="var(--sky-blue-black-gradient)"
                  handleToggle={() => setSoundEffect(!soundEffect)}
                />
                {!soundEffect ? "Off" : "On"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Sound isPlaying={isPlaying} />
      <Link to="/">
        <button className="button">Back</button>
      </Link>
    </section>
  );
};

export default Options;
