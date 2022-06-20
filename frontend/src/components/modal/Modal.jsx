import React from "react";
import "./modal.css";
import { RiCloseLine } from "react-icons/ri";
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
      <div className="darkBG" onClick={() => setIsOpen(false)} />
      <div className="centered">
        <div className="modal">
          <div className="modalHeader">
            <h1 className="reward_text">{numbers}</h1>
          </div>
          {/* <button className="closeBtn" onClick={() => setIsOpen(false)}>
            <RiCloseLine style={{ marginBottom: "-3px" }} />
          </button> */}
          <div className="modalContent">
          <h2 className="reward_text">You have won</h2>
          <h1 className="reward_text">{tokenWon} DOW</h1>
           <br></br>
           <p> {message}</p>
            <br></br>
            <p>Play Again?</p>
          </div>

          <div className="modalActions">
            <div className="actionsContainer">
              <button
                className="deleteBtn"
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
              <button className="cancelBtn" onClick={() => { navigate("/") }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
