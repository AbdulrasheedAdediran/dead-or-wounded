import { React, useState, useEffect } from "react";
import "./App.css";
import StartGame from "./components/container/StartGame/StartGame";
import HowToPlay from "./components/container/HowToPlay/HowToPlay";
import Options from "./components/container/Options/Options";
import About from "./components/container/About/About";
import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers, utils, Contract } from "ethers";
import DOW_ABI from "./util/DOW_ABI.json";
import Footer from "./components/Footer/Footer";
import { Sequelize } from "sequelize";
import env from "react-dotenv";
const DOWContract = "0x00B02f1D3b5B75279C2931235bE464688dd5dDC4";
const App = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [generatedValues, setGeneratedValues] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loadingSuccess, setLoadingSuccess] = useState(null);
  const [userBalance, setUserBalance] = useState({
    DOWTokenBalance: 0,
    networkCoinBalance: 0,
  });
  // const [insufficientTokens, setInsufficientTokens] = useState(false)
  // useEffect(() => {
  //   setLoadingSuccess(null);
  // }, []);

  // Handle player's statistics
  const [playerStatistics, setPlayerStatistics] = useState({
    gamesPlayed: 0,
    gamesLost: 0,
    currentWinStreak: 0,
    highestWinStreak: 0,
    gamesWon: 0,
  });

  // Requests wallet connection
  const connectWallet = async () => {
    if (window.ethereum || window.web3) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        eagerConnect();
        if (connected) {
          addPlayerToDB();
          setWalletAddress(accounts[0]);
          getUserBalance(accounts[0]);
          getPlayerStatistics();
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Please Use a Web3 Enable Browser or Install Metamask");
    }
  };
  // Eagerly connects user and fetches their account data
  const eagerConnect = async () => {
    const networkID = await window.ethereum.request({
      method: "eth_chainId",
    });
    if (Number(networkID) !== 80001) {
      setConnected(false);
    } else setConnected(true);
    const accounts = await provider.listAccounts();
    const userAccount = await getUserBalance(accounts[0]);

    if (!accounts.length) {
      return;
    } else {
      setUserBalance({
        DOWTokenBalance: userAccount.formartedDOWTokenBalance,
        networkCoinBalance: userAccount.formartedNetworkCoinBalance,
      });

      setConnected(true);
       addPlayerToDB();
      setWalletAddress(accounts[0]);
      getPlayerStatistics();
    }
  };

  // Airdrop free DOW tokens to new players
  const claimFreeTokens = async (e) => {
    e.preventDefault();
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner(accounts[0]);
    const DOWContractInstance = new Contract(DOWContract, DOW_ABI, signer);
    await DOWContractInstance.claimFreeTokens();
  };

  // Gets user chain balance and DOW token balance
  const getUserBalance = async () => {
    const accounts = await provider.listAccounts();
    try {
      const networkCoinBalance = await provider.getBalance(accounts[0]);
      const DOWContractInstance = new Contract(DOWContract, DOW_ABI, provider);
      const DOWTokenBalance = await DOWContractInstance.balanceOf(accounts[0]);
      const formartedNetworkCoinBalance = utils.formatUnits(
        networkCoinBalance,
        18
      );

      const formartedDOWTokenBalance = utils.formatUnits(DOWTokenBalance, 18);
      setUserBalance({
        DOWTokenBalance: formartedDOWTokenBalance,
        networkCoinBalance: formartedNetworkCoinBalance,
      });
      console.log("DOWTokenBalance:", DOWTokenBalance);
      console.log("formartedNetworkCoinBalance:", formartedNetworkCoinBalance);
      return { formartedNetworkCoinBalance, formartedDOWTokenBalance };
    } catch (error) {
      console.error(error);
    }
  };
  // Get player's statistics
  const getPlayerStatistics = async () => {
     console.log("hello");
     console.log("connect", window.env.DATABASE_URL);
     const connectionString = window.env.DATABASE_URL;
    let playerStats;
    const sequelize = new Sequelize(connectionString, {
      host: "localhost",
      dialect: "mysql",
    });
    const Player = sequelize.define("Players", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      address: {
        type: Sequelize.STRING,
      },
      gamesPlayed: {
        type: Sequelize.INTEGER,
      },
      unclaimedTokens: {
        type: Sequelize.INTEGER,
      },
      gamesLost: {
        type: Sequelize.INTEGER,
      },
      currentWinStreak: {
        type: Sequelize.INTEGER,
      },
      maxWinStreak: {
        type: Sequelize.INTEGER,
      },
      gamesWon: {
        type: Sequelize.INTEGER,
      },
    });

    Player.sync({
      force: false,
    })
      .then(async () => {
        playerStats = await Player.findOne({
          where: { address: walletAddress },
        });
        const played = playerStats.gamesPlayed;
        const won = playerStats.gamesWon;
        const lost = playerStats.gamesLost;
        const currentStreak = playerStats.currentWinStreak;
        const highestStreak = playerStats.maxWinStreak;
        setPlayerStatistics({
          gamesPlayed: Number(played),
          gamesWon: Number(won),
          gamesLost: Number(lost),
          currentWinStreak: Number(currentStreak),
          highestWinStreak: Number(highestStreak),
        });
        console.log('player', playerStats);
      })
      .catch(function (err) {
        console.error("error: " + err.message);
        process.exit(1);
      });

    // await playerStats.wait();
  };

  // Start game
  const startGame = async () => {
    setLoadingSuccess(null);
    setLoader(true);
    getPlayerStatistics();
    let randomNumbers = [];
    const signer = provider.getSigner();
    const DOWContractInstance = new Contract(DOWContract, DOW_ABI, signer);

    if (userBalance.DOWTokenBalance < 5) {
      alert("Insufficient DOW Tokens, you need at least 5 DOW Tokens to play");
      return;
    }
    let playGame;
    try {
      playGame = await DOWContractInstance.startGame();
      const gameData = await playGame.wait();
      console.log("randNum", gameData.events[2].args.compNum);
      randomNumbers = gameData.events[2].args.compNum;
      const convertedValues = randomNumbers.map((randomNumber) =>
        Number(randomNumber)
      );
      setGeneratedValues([...generatedValues, convertedValues]);
      setLoader(false);
      setLoadingSuccess(true);
    } catch (err) {
      console.log("err", err);
      setLoader(false);
      setLoadingSuccess(false);
    }
  };

  // Check number of trials it took player to win and reward player
  const addPlayerToDB = async () => {
    console.log('hello')
    console.log("connect", env.DATABASE_URL);
    const connectionString = env.DATABASE_URL;
    const sequelize = new Sequelize(connectionString, {
      host: "localhost",
      dialect: "mysql",
    });
    const Player = sequelize.define("Players", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      address: {
        type: Sequelize.STRING,
      },
      gamesPlayed: {
        type: Sequelize.INTEGER,
      },
      unclaimedTokens: {
        type: Sequelize.INTEGER,
      },
      gamesLost: {
        type: Sequelize.INTEGER,
      },
      currentWinStreak: {
        type: Sequelize.INTEGER,
      },
      maxWinStreak: {
        type: Sequelize.INTEGER,
      },
      gamesWon: {
        type: Sequelize.INTEGER,
      },
    });

    Player.sync({
      force: false,
    })
      .then(async () => {
        const user = await Player.findOne({
          where: { address: walletAddress },
        });
        if (user === null) {
          return Player.create({
            id: (new Date().getTime() / 1000).toFixed(),
            address: walletAddress,
            gamesPlayed: 0,
            unclaimedTokens: 0,
            gamesLost: 0,
            currentWinStreak: 0,
            maxWinStreak: 0,
            gamesWon: 0,
          });
        }
      })
      .then(async () => {
        const users = await Player.findAll();
        console.log("users", users);
      })
      .catch(function (err) {
        console.error("error: " + err.message);
        process.exit(1);
      });
  };
  const checkTrials = async (trial) => {
    let win;
    if (trial === 1) {
      win = 20000000000000000000;
    } else if (trial === 2) {
      win = 20000000000000000000;
    } else if (trial === 3) {
      win = 20000000000000000000;
    } else if (trial === 4) {
      win = 12000000000000000000;
    } else if (trial === 5) {
      win = 12000000000000000000;
    } else if (trial === 6) {
      win = 7000000000000000000;
    } else if (trial === 7) {
      win = 7000000000000000000;
    } else if (trial === 8) {
      win = 7000000000000000000;
    }

    const connectionString = process.env.DATABASE_URL;
    const sequelize = new Sequelize(connectionString, {
      host: "localhost",
      dialect: "mysql",
    });
    const Player = sequelize.define("Players", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      address: {
        type: Sequelize.STRING,
      },
      gamesPlayed: {
        type: Sequelize.INTEGER,
      },
      unclaimedTokens: {
        type: Sequelize.INTEGER,
      },
      gamesLost: {
        type: Sequelize.INTEGER,
      },
      currentWinStreak: {
        type: Sequelize.INTEGER,
      },
      maxWinStreak: {
        type: Sequelize.INTEGER,
      },
      gamesWon: {
        type: Sequelize.INTEGER,
      },
    });

    Player.sync({
      force: false,
    })
      .then(async () => {
        const user = await Player.findOne({
          where: { address: walletAddress },
        });
        return user.update({
          gamesPlayed: user.gamesPlayed + 1,
          unclaimedTokens: user.unclaimedTokens + win,
          gamesLost: trial === 8 ? user.gamesLost + 1 : user.gamesLost,
          currentWinStreak: trial < 8 ? user.currentWinStreak + 1 : 0,
          maxWinStreak:
            user.currentWinStreak >= user.maxWinStreak
              ? user.currentWinStreak
              : user.maxWinStreak,
          gamesWon: trial < 8 ? user.gamesWon + 1 : user.gamesWon,
        });
      })
      .then(async () => {
        const user = await Player.findOne({
          where: { address: walletAddress },
        });
        console.log('user', user);
      })
      .catch(function (err) {
        console.error("error: " + err.message);
        process.exit(1);
      });
  };
  //Alerts user to switch to a supported network when account is switched from a supported network
  const handleAccountChanged = async (accounts) => {
    if (accounts.length) {
      const networkID = await window.ethereum.request({
        method: "eth_chainId",
      });
      if (Number(networkID) !== 80001) return;
      const userAccount = await getUserBalance(accounts[0]);
      setWalletAddress(accounts[0]);
      getPlayerStatistics();
      setUserBalance({
        DOWTokenBalance: userAccount.formartedDOWTokenBalance,
        networkCoinBalance: userAccount.formartedNetworkCoinBalance,
      });
      setConnected(true);
      window.location.reload();
    } else {
      setConnected(false);
      setUserBalance({
        DOWTokenBalance: 0,
        networkCoinBalance: 0,
      });
      setPlayerStatistics({
        gamesPlayed: 0,
        gamesLost: 0,
        currentWinStreak: 0,
        highestWinStreak: 0,
        gamesWon: 0,
      });
    }
  };

  //Alerts user to switch to a supported network when account is switched from a supported network
  const handleChainChanged = async () => {
    const networkID = await window.ethereum.request({
      method: "eth_chainId",
    });
    if (Number(networkID) !== 80001) {
      setConnected(false);

      alert(
        "You're currently connected to an unsupported network, please switch to Polygon Mumbai Testnet"
      );
      window.location.reload();
      return;
    } else {
      connectWallet();
      setConnected(true);
      window.location.reload();
    }
  };

  const init = async () => {
    const accounts = await provider.listAccounts();
    if (!accounts.length) return;
    const userAccount = await getUserBalance(accounts[0]);
    setUserBalance({
      DOWTokenBalance: userAccount.formartedDOWTokenBalance,
      networkCoinBalance: userAccount.formartedNetworkCoinBalance,
    });
    setConnected(true);
    setWalletAddress(accounts[0]);
    getPlayerStatistics();
  };
  useEffect(() => {
    init();
    if (!window.ethereum) return;

    window.ethereum.on("connect", eagerConnect);
    window.ethereum.on("connect", getPlayerStatistics);
    window.ethereum.on("connect", getUserBalance);
    window.ethereum.on("accountsChanged", handleAccountChanged);
    // window.ethereum.removeListener("chainChanged", handleChainChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loadingSuccess === false) alert("Connection Failed");
  }, [loadingSuccess]);

  const getCoinBalance = async () => {
    const accounts = await provider.listAccounts();
    const networkCoinBalance = await provider.getBalance(accounts[0]);
    const formartedNetworkCoinBalance = utils.formatUnits(
      networkCoinBalance,
      18
    );

    console.log("networkCoinBalance:", networkCoinBalance);
    console.log("formartedNetworkCoinBalance:", formartedNetworkCoinBalance);
  };

  getCoinBalance();
  return (
    <>
      <Navbar
        connectWallet={connectWallet}
        connected={connected}
        walletAddress={walletAddress}
        userBalance={userBalance}
      />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Main
                claimFreeTokens={claimFreeTokens}
                connected={connected}
                startGame={startGame}
                userBalance={userBalance}
              />
            }
          />
          <Route
            path="/startGame"
            exact
            element={
              <StartGame
                generatedValues={generatedValues}
                connected={connected}
                userBalance={userBalance}
                setUserBalance={setUserBalance}
                playerStatistics={playerStatistics}
                setPlayerStatistics={setPlayerStatistics}
                connectWallet={connectWallet}
                eagerConnect={eagerConnect}
                startGame={startGame}
                checkTrials={checkTrials}
                claimFreeTokens={claimFreeTokens}
                provider={provider}
                DOWContract={DOWContract}
                loader={loader}
                loadingSuccess={loadingSuccess}
              />
            }
          />
          <Route path="/howToPlay" exact element={<HowToPlay />} />
          <Route path="/options" exact element={<Options />} />
          <Route path="/about" exact element={<About />} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </>
  );
};

export default App;

// handleSignMessage = ({ publicAddress, nonce }) => {
//   return new Promise((resolve, reject) =>
//     web3.personal.sign(
//       web3.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
//       publicAddress,
//       (err, signature) => {
//         if (err) return reject(err);
//         return resolve({ publicAddress, signature });
//       }
//     )
//   );
// };
