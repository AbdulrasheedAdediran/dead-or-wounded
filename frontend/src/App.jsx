import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ethers, utils, Contract } from "ethers";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnectProvider from "@walletconnect/web3-provider";
import * as UAuthWeb3Modal from "@uauth/web3modal";
import UAuthSPA from "@uauth/js";
import "./App.css";
import StartGame from "./components/container/StartGame/StartGame";
import HowToPlay from "./components/container/HowToPlay/HowToPlay";
import Options from "./components/container/Options/Options";
import About from "./components/container/About/About";
import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import Footer from "./components/Footer/Footer";
import MetaMaskLogo from "./components/assets/metamask.svg";
import DOW_ABI from "./util/DOW_ABI.json";
const DOWContract = "0x9738600cae44184C96d7F81991D7dA859b521847";

const App = () => {
  const [connected, setConnected] = useState(false);
  const [provider, setProvider] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [generatedValues, setGeneratedValues] = useState([]);
  const [loader, setLoader] = useState(false);
  const [loadingSuccess, setLoadingSuccess] = useState(null);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [account, setAccount] = useState();
  const [network, setNetwork] = useState();
  const [chainId, setChainId] = useState();
  const [userBalance, setUserBalance] = useState({
    DOWTokenBalance: 0,
    networkCoinBalance: 0,
  });
  const [playerStatistics, setPlayerStatistics] = useState({
    gamesPlayed: 0,
    gamesLost: 0,
    currentWinStreak: 0,
    highestWinStreak: 0,
    gamesWon: 0,
  });

  //==========================//
  // WEB3MODAL INTEGRATION
  //==========================//

  useEffect(() => {
    // initiate web3modal
    const uauthOptions = {
      clientID: "client_id",
      redirectUri: "http://localhost:3000",
      scope: "openid wallet",
    };
    const providerOptions = {
      injected: {
        display: {
          logo: MetaMaskLogo,
          type: "injected",
          check: "isMetaMask",
          description: "Connect to your MetaMask Wallet",
        },
        package: true,
      },

      walletconnect: {
        package: WalletConnectProvider,
        options: {
          alchemyId: process.env.REACT_APP_ALCHEMY_KEY,
          rpc: process.env.REACT_APP_MUMBAI_RPC_URL,
        },
      },

      coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
          appName: "Dead or Wounded",
          alchemyId: process.env.REACT_APP_ALCHEMY_KEY,
          rpc: process.env.REACT_APP_MUMBAI_RPC_URL,
          chainId: 80001,
          darkMode: true,
        },
      },

      "custom-uauth": {
        display: UAuthWeb3Modal.display,
        connector: UAuthWeb3Modal.connector,
        package: UAuthSPA,
        options: uauthOptions,
      },
    };
    const newWeb3Modal = new Web3Modal({
      cacheProvider: false, // very important
      network: "maticmum",
      disableInjectedProvider: false,
      displayNoInjectedProvider: false,
      theme: {
        background: "rgb(20,30,30, 0.65)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(40, 240, 5, 0.05)",
        hover: "rgb(16, 45, 35, 0.9)",
      },
      providerOptions,
    });
    // Registers the web3modal so the connector has access to it.
    UAuthWeb3Modal.registerWeb3Modal(newWeb3Modal);

    setWeb3Modal(newWeb3Modal);
  }, []);
  //==========================//
  //==========================//
  // Eagerly connects user and fetches their account data
  // const eagerConnect = async () => {
  //   const networkID = await provider.getNetwork();
  //   setNetwork(networkID);
  //   setChainId(await networkID.chainId);
  //   console.log("Chain ID next");
  //   console.log(await networkID.chainId);
  //   if (networkID.chainId !== 80001) {
  //     setConnected(false);
  //   } else;
  //   const accounts = await provider.listAccounts();

  //   if (!accounts.length) {
  //     return;
  //   } else {
  //     const userAccount = await getUserBalance(accounts[0]);
  //     setUserBalance({
  //       DOWTokenBalance: userAccount.formartedDOWTokenBalance,
  //       networkCoinBalance: userAccount.formartedNetworkCoinBalance,
  //     });

  //     setConnected(true);
  //     setWalletAddress(accounts[0]);
  //     getPlayerStatistics();
  //   }
  // };
  // Requests wallet connection
  const connectWallet = async () => {
    try {
      const connectedProvider = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(connectedProvider);
      const accounts = await provider.listAccounts();
      const networkID = await provider.getNetwork();
      //================
      //================
      setNetwork(networkID);
      setChainId(networkID.chainId);
      setProvider(provider);
      setWalletAddress(accounts[0]);
      setAccount(accounts[0]);
      getUserBalance(accounts[0]);
      setConnected(true);
    } catch (err) {
      console.log(err);
    }
  };

  const refreshState = () => {
    // setAccount(null);
    // setChainId(null);
    // setNetwork(null);
    // setWalletAddress();
    // setUserBalance(undefined);
    setConnected(false);
  };

  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  // Airdrop free DOW tokens to new players
  const claimFreeTokens = async () => {
    // e.preventDefault();
      console.log("Trying to claim");
      const accounts = await provider.listAccounts();
      const signer = provider.getSigner(accounts[0]);
      const DOWContractInstance = new Contract(DOWContract, DOW_ABI, signer);
      await DOWContractInstance.claimFreeTokens();
      console.log('Claimed')
  };

  // Gets user chain balance and DOW token balance
  const getUserBalance = async (userAccount) => {
    // const accounts = await provider.listAccounts();
    if (provider == null) return;
    try {
      const networkCoinBalance = await provider.getBalance(userAccount);
      const DOWContractInstance = new Contract(DOWContract, DOW_ABI, provider);
      const DOWTokenBalance = await DOWContractInstance.balanceOf(userAccount);
      const formartedNetworkCoinBalance = utils.formatUnits(
        networkCoinBalance,
        18
      );

      const formartedDOWTokenBalance = utils.formatUnits(DOWTokenBalance, 18);
      setUserBalance({
        DOWTokenBalance: formartedDOWTokenBalance,
        networkCoinBalance: formartedNetworkCoinBalance,
      });
      return { formartedNetworkCoinBalance, formartedDOWTokenBalance };
    } catch (error) {
      console.error(error);
    }
  };
  // Get player's statistics
  const getPlayerStatistics = async () => {
    const signer = provider.getSigner();
    const DOWContractInstance = new Contract(DOWContract, DOW_ABI, signer);

    const playerStats = await DOWContractInstance.checkStreak();

    // await playerStats.wait();
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
    try {
      const playGame = await DOWContractInstance.startGame();
      const gameData = await playGame.wait();
      randomNumbers = gameData.events[2].args.compNum;
      const convertedValues = randomNumbers.map((randomNumber) =>
        Number(randomNumber)
      );
        console.log(convertedValues)
      setGeneratedValues([...generatedValues, convertedValues]);
      await getUserBalance(account);
      setLoader(false);
      setLoadingSuccess(true);
    } catch {
      setLoader(false);
      setLoadingSuccess(false);
    }
  };
  // Check number of trials it took player to win and reward player
  const checkTrials = async (trial) => {
    const signer = provider.getSigner();
    const DOWContractInstance = new Contract(DOWContract, DOW_ABI, signer);
    const trials = await DOWContractInstance.checkTrials(trial);
    trials.wait();
    getUserBalance(account);
  };

  const init = async () => {
    if (provider == null) return;
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
    if (provider?.on) {
      //Alerts user to switch to a supported network when account is switched from a supported network
      const handleAccountChanged = async (accounts) => {
        if (accounts.length) {
          const networkID = await provider.request({
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
        const networkID = await provider.request({
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

      provider.on("disconnect", disconnectWallet);
      provider.on("connect", getPlayerStatistics);
      provider.on("connect", getUserBalance);
      provider.on("accountsChanged", handleAccountChanged);
      provider.on("chainChanged", handleChainChanged);
      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", disconnectWallet);
        }
      };
    }
  }, [provider]);

  useEffect(() => {
    if (loadingSuccess === false) alert("Connection Failed");
  }, [loadingSuccess]);

  return (
    <>
      <Navbar
        claimFreeTokens={claimFreeTokens}
        connectWallet={connectWallet}
        connected={connected}
        walletAddress={walletAddress}
        userBalance={userBalance}
        disconnectWallet={disconnectWallet}
        playerStatistics={playerStatistics}
      />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            exact
            element={
              <Main
                connectWallet={connectWallet}
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
                // eagerConnect={eagerConnect}
                startGame={startGame}
                checkTrials={checkTrials}
                claimFreeTokens={claimFreeTokens}
                provider={provider}
                DOWContract={DOWContract}
                loader={loader}
                loadingSuccess={loadingSuccess}
                getUserBalance={getUserBalance}
                account={account}
              />
            }
          />
          <Route path="/howToPlay" exact element={<HowToPlay />} />
          <Route path="/options" exact element={<Options />} />
          <Route path="/about" exact element={<About />} />
        </Routes>
      </BrowserRouter>
      {/* <Footer /> */}
    </>
  );
};

export default App;
