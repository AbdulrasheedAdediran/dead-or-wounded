import React from "react";
import "./Switch.css";
const Switch = ({ isOn, handleToggle, onColor }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`${handleToggle}`}
        type="checkbox"
      />
      <label
        style={{ background: isOn && onColor }}
        className="react-switch-label"
        htmlFor={`${handleToggle}`}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;
