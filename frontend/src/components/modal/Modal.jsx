import React from "react";
import "./modal.css";
// import { RiCloseLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const Modal = ({
  setIsOpen,
  message,
  numbers,
  startGame,
  setRoundScores,
  entries,
  setPlayerInput,
  tokenWon,
}) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="dark-bg" onClick={() => setIsOpen(false)} />
      <div className="modal-container">
        <div className="modal-text">
          <p> {message}</p>
          {/* <button className="closeBtn" onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button> */}
          <div className="modal-content">
            <p className="generated-numbers">{numbers}</p>

            <p className="reward-text">Reward: {tokenWon} DOW</p>
          </div>
          <p className="play-again">Play Again?</p>
        </div>
        <div className="modal-actions">
          <button
            className="no-btn"
            onClick={() => {
              navigate("/");
            }}
          >
            No
          </button>
          <button
            className="yes-btn"
            onClick={() => {
              entries.reset();
              setPlayerInput([]);
              setRoundScores([]);
              startGame();
              setIsOpen(false);
            }}
          >
            Yes
          </button>
        </div>
      </div>
    </>
  );
};

export default Modal;
