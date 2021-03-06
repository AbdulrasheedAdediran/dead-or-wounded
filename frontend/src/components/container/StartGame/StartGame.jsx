import { React, useState, useEffect, useRef } from "react";
import "./StartGame.css";
import Scoreboard from "./Scoreboard";
import { useNavigate } from "react-router-dom";
import Modal from "../../modal/Modal";
import DOW_ABI from "../../../util/DOW_ABI.json";
import Loader from "../loader/Loader";
import { Contract } from "ethers";
const StartGame = ({
  generatedValues,
  playerStatistics,
  connected,
  startGame,
  userBalance,
  checkTrials,
  claimFreeTokens,
  DOWContract,
  provider,
  loadingSuccess,
  loader,
  getPlayerStatistics,
  getUserBalance,
  account,
}) => {
  let navigate = useNavigate();
  const [playerInput, setPlayerInput] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(false);
  const [viewScoreboard, setViewScoreboard] = useState(false);
  // const [startSignal, setStartSignal] = useState(false);
  const [flicker, setFlicker] = useState(false);
  const randomNumbers = generatedValues;
  const [roundScores, setRoundScores] = useState([]);
  let [dead, setDead] = useState(0);
  let [wounded, setWounded] = useState(0);
  const [trials, setTrials] = useState(1);
  const [index, setIndex] = useState(0);
  const [tokenWon, setTokenwon] = useState(0);
  const [isLoading, setIsLoading] = useState(null);
  const entries = document.querySelector(".entries");
  const signer = provider.getSigner();
  const DOWContractInstance = new Contract(DOWContract, DOW_ABI, signer);
  const startSignalRef = useRef();

  //===========================//
  //--Handles Start Game Call--//
  //===========================//
  useEffect(() => {
    setTimeout(() => {
      if (document.readyState === "complete") {
        callStart();
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callStart = async () => {
    await startGame();
    if (loadingSuccess) {
      // await handleStartSignal();
    }
    // startSignalRef.current.classList.remove("view");
  };
  //=================================//
  //-Handles Backspace & Enter Keys--//
  //=================================//
  useEffect(() => {
    const listener = (e) => {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        e.preventDefault();
        handlePlay(e);
      }
      if (e.code === "Backspace") {
        e.preventDefault();
        handleClear(e);
      }
    };
    document.addEventListener("keyup", listener);
    return () => {
      document.removeEventListener("keyup", listener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document, playerInput]);
  //==========================//
  //--Handles Number Buttons--//
  //==========================//
  const handleNumberButton = (e) => {
    e.preventDefault();
    // Form that wraps input fields
    const entries = document.querySelector(".entries");
    // Targets onScreen buttons
    const target = e.target;
    // Max length of each input field
    const maxLength = parseInt(entries[index].attributes["maxlength"].value);
    // Current input field
    const current = entries[index];
    // Next input field
    const next = entries[index].nextElementSibling;
    current.value = parseInt(target.value);
    // Stop pushing to array when all inputs are filled
    if (playerInput.length < 4) {
      setPlayerInput((playerInput) => [...playerInput, parseInt(target.value)]);
    }
    // Move focus to next input field if focus is not on the last input field
    if (current.value.length >= maxLength && next !== null) {
      setIndex(index + 1);
      next.focus();
    } // Keep focus on current input field if it is the last input field
    else if (current.value.length >= maxLength && next === null) {
      entries[index].value = playerInput[3];
      setIndex(index);
      current.focus();
    }
  };
  //=========================//
  //--Handles Keyboard Input--//
  //=========================//
  const handlePlayerInput = (e) => {
    e.preventDefault();
    // Targets the input fields
    const target = e.target;
    // Max length of each input field
    const maxLength = parseInt(target.attributes["maxlength"].value);
    // Previous input field
    // const previous = target.previousElementSibling;
    // Next input field
    const next = target.nextElementSibling;
    // Wrapper for all input fields
    const inputs = document.querySelectorAll(".input");

    // Set valid inputs to be numbers 0 - 9
    const regX = /^[0-9]+$/;
    // Checks if inputs entered are valid and stores them in an array
    if (regX.test(target.value)) {
      setPlayerInput((playerInput) => [...playerInput, parseInt(target.value)]);
    } // Set entry to "" and keep focus on current input field if entry is invalid
    else {
      target.value = "";
      target.focus();
    }
    // Container for all input fields
    let container = document.getElementsByClassName("input")[0];
    container.onkeyup = (e) => {
      // Length of current input field
      const focusedInputLength = target.value.length;
      // Last input field
      const lastInput = inputs[inputs.length - 1];
      // Move focus to next input field if entry is valid and it is not the last input field
      if (
        focusedInputLength >= maxLength &&
        regX.test(e.target.value) &&
        next !== null
      ) {
        next.focus();
      } // Keep focus on current input field if it is the last input field
      else if (target === lastInput && next === null) {
        target.focus();
      }
    };
  };

  //=======================//
  //-Handles Clear Button--//
  //=======================//
  const handleClear = (e) => {
    e.preventDefault();
    // startSignalRef.current.classList.remove("view");
    const entries = document.querySelector(".entries");
    const maxLength = parseInt(entries[index].attributes["maxlength"].value);
    const previous = entries[index].previousElementSibling;
    const current = entries[index];
    // let currentValue = entries[index].value;
    const next = entries[index].nextElementSibling;
    if (next === null && current.value.length >= maxLength) {
      entries[index].value = "";
      current.focus();
      playerInput.pop();
    } else if (
      next === null ||
      (previous !== null && current.value.length < maxLength)
    ) {
      setIndex(index - 1);
      previous.value = "";
      previous.focus();
      playerInput.pop();
    } else if (previous === null && current.value.length < maxLength) {
      setIndex(index);
      entries[index].value = "";
      current.focus();
      setPlayerInput([]);
    }
  };

  //=============================//
  //--Toggles Scoreboard: Mobile-//
  //=============================//
  // const handleStartSignal = async () => {
  //   startSignalRef.current.classList.add("view");
  // };
  //=============================//
  //--Toggles Scoreboard: Mobile-//
  //=============================//
  const toggleScoreboard = () => {
    setViewScoreboard(!viewScoreboard);
  };

  //=======================//
  //--Checks for Duplicate-//
  //=======================//
  const containsDuplicate = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < i; j++) {
        if (arr[i] === arr[j]) {
          return true;
        }
      }
    }
    return false;
  };
  //=======================//
  //----  Handles Play ----//
  //=======================//
  const handlePlay = async (e) => {
    e.preventDefault();
    const inputs = document.querySelectorAll(".input");
    const winMessage = "WAY TO GO GENIUS, YOU WON!!!";
    const loseMessage = "GAME OVER! BETTER LUCK NEXT TIME";
    let firstInput = inputs[0];
    if (playerInput.length < 4) {
      alert("INCOMPLETE ENTRIES");
      return;
    }
    if (containsDuplicate(playerInput)) {
      alert("NUMBERS MUST BE UNIQUE");
      return;
    } else {
      if (trials <= 7 && dead !== 4) {
        setDead((dead = 0));
        setWounded((wounded = 0));
        setTrials((trials) => (trials += 1));
        // Check player input and return round scores
        for (let i = 0; i < 4; i++) {
          // Check if player input is in the correct index of random numbers
          if (playerInput[i] === randomNumbers[i]) {
            setDead((dead += 1));
          }
          // Check if player guess is in the sequence but not in the correct index of random numbers
          for (let j = 0; j < 4; j++) {
            if (
              playerInput[i] !== randomNumbers[i] &&
              playerInput[i] === randomNumbers[j]
            ) {
              setWounded((wounded += 1));
            }
          }
        }

        setRoundScores([
          ...roundScores,
          {
            trial: trials,
            attempt: playerInput,
            dead: dead,
            wounded: wounded,
          },
        ]);
        toggleScoreboard();
        setFlicker(!flicker);
        entries.reset();
        setIndex(0);
        setPlayerInput([]);
        firstInput.attributes["autofocus"] = true;
        entries[0].focus();
      }
    }

    if (trials <= 7 && dead === 4) {
      setMessage(winMessage);
      setIsLoading(true);
      const res = await DOWContractInstance.checkTrials(trials);
      res.wait();
      setIsLoading(false);
      setIsOpen(true);
      await getUserBalance();
      await getPlayerStatistics();
      setTrials(1);
      trials <= 2
        ? setTokenwon(25)
        : trials >= 3 || trials <= 7
        ? setTokenwon(20)
        : setTokenwon(0);
    } else if (trials >= 7 && dead !== 4) {
      setMessage(loseMessage);
      setIsLoading(true);
      const res = await DOWContractInstance.checkTrials(8);
      res.wait();
      setIsLoading(false);
      setIsOpen(true);
      entries.reset();
      setTrials(1);
    }
  };

  return (
    <section className="start-game">
      {loader && <Loader />}
      {isLoading && <Loader />}
      {loadingSuccess === false && navigate("/")}
      {/* <p
        ref={startSignalRef}
        className="start-signal"
        className={`start-signal ${startSignal ? "view" : ""}`}
      >
        START
      </p> */}

      <form className="entries" action="#" onSubmit={handlePlay}>
        <label htmlFor="player-inputs">Enter four unique numbers</label>
        <div className="input">
          <input
            type="text"
            maxLength={1}
            name="player-inputs"
            id="playerInput1"
            className="first-player-input player-input"
            value={playerInput[0]}
            onChange={handlePlayerInput}
            autoComplete="off"
            autoFocus={true}
            required={true}
          ></input>
          <input
            type="text"
            maxLength={1}
            name="player-inputs"
            id="playerInput2"
            className="second-player-input player-input"
            value={playerInput[1]}
            onChange={handlePlayerInput}
            autoComplete="off"
            required={true}
          ></input>
          <input
            type="text"
            maxLength={1}
            name="player-inputs"
            id="playerInput3"
            className="third-player-input player-input"
            value={playerInput[2]}
            onChange={handlePlayerInput}
            autoComplete="off"
            required={true}
          ></input>
          <input
            type="text"
            maxLength={1}
            name="player-inputs"
            id="playerInput4"
            className="fourth-player-input player-input"
            value={playerInput[3]}
            onChange={handlePlayerInput}
            autoComplete="off"
            required={true}
          ></input>
        </div>
        <div className="number-btns">
          <div className="number-btn-row">
            <button
              className="number-btn"
              // disabled={!isDisabled}
              value="1"
              onClick={handleNumberButton}
            >
              1
            </button>
            <button
              className="number-btn"
              // disabled={!isDisabled}
              value="2"
              onClick={handleNumberButton}
            >
              2
            </button>
            <button
              className="number-btn"
              // disabled={!isDisabled}
              value="3"
              onClick={handleNumberButton}
            >
              3
            </button>
          </div>
          <div className="number-btn-row">
            <button
              className="number-btn"
              // disabled={!isDisabled}
              value="4"
              onClick={handleNumberButton}
            >
              4
            </button>
            <button
              className="number-btn"
              // disabled={!isDisabled}
              value="5"
              onClick={handleNumberButton}
            >
              5
            </button>
            <button
              className="number-btn"
              // disabled={!isDisabled}
              value="6"
              onClick={handleNumberButton}
            >
              6
            </button>
          </div>
          <div className="number-btn-row">
            <button
              className="number-btn"
              // disabled={!isDisabled}
              value="7"
              onClick={handleNumberButton}
            >
              7
            </button>
            <button
              className="number-btn"
              // disabled={!isDisabled}
              value="8"
              onClick={handleNumberButton}
            >
              8
            </button>
            <button
              className="number-btn"
              // disabled={!isDisabled}
              value="9"
              onClick={handleNumberButton}
            >
              9
            </button>
          </div>
          <div className="number-btn-row">
            <button
              className="number-btn"
              // disabled={!isDisabled}
              value="0"
              onClick={handleNumberButton}
            >
              0
            </button>
          </div>
        </div>

        <div className="clear-play-btns">
          <button className="game-btn clear" onClick={handleClear}>
            Clear
          </button>

          <button className="game-btn play" onClick={handlePlay}>
            Play
          </button>
        </div>
      </form>
      <div className={`overlay ${viewScoreboard ? "view" : ""}`}></div>
      <div className={`scoreboard-mobile ${viewScoreboard ? "view" : ""}`}>
        <Scoreboard
          trial={trials}
          confirmedAttempt={playerInput}
          dead={dead}
          wounded={wounded}
          roundScores={roundScores}
          flicker={flicker}
        />
      </div>
      <button className="scoreboard-mobile-btn" onClick={toggleScoreboard}>
        {viewScoreboard ? "Continue" : "View Scoreboard"}
      </button>
      {/* <button onClick={handleStartSignal}>Signal</button> */}

      {isOpen && (
        <Modal
          DOWContract={DOWContract}
          signer={signer}
          generatedValues={generatedValues}
          playerStatistics={playerStatistics}
          connected={connected}
          userBalance={userBalance}
          checkTrials={checkTrials}
          claimFreeTokens={claimFreeTokens}
          provider={provider}
          startGame={startGame}
          setIsOpen={setIsOpen}
          message={message}
          numbers={generatedValues}
          setRoundScores={setRoundScores}
          entries={entries}
          setPlayerInput={setPlayerInput}
          tokenWon={tokenWon}
        />
      )}
      {/* <Link to="/">
        <button>Back</button>
      </Link> */}
    </section>
  );
};

export default StartGame;
