import { Routes, Route, useLocation } from "react-router-dom";
import { ethers, utils, Contract } from "ethers";
import { useState, useEffect } from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import * as UAuthWeb3Modal from "@uauth/web3modal";
import Web3Modal from "web3modal";
import UAuthSPA from "@uauth/js";
import "./App.css";
import StartGame from "./components/container/StartGame/StartGame";
import HowToPlay from "./components/container/HowToPlay/HowToPlay";
import Options from "./components/container/Options/Options";
import About from "./components/container/About/About";
import Navbar from "./components/Navbar/Navbar";
import Main from "./components/Main/Main";
import MetaMaskLogo from "./components/assets/metamask.svg";
import DOW_ABI from "./util/DOW_ABI.json";
const DOWContract = "0xe0D3C042D557dfc16670e43B2bBc6752216a539e";

const App = () => {
  const [generatedValues, setGeneratedValues] = useState([]);
  const [loadingSuccess, setLoadingSuccess] = useState(null);
  const [walletAddress, setWalletAddress] = useState();
  const [connected, setConnected] = useState(false);
  const [web3Modal, setWeb3Modal] = useState(null);
  const [claimed, setClaimed] = useState(false);
  const [loader, setLoader] = useState(false);
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  const [chainId, setChainId] = useState();
  const [proxy, setProxy] = useState();
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
  const location = useLocation();

  //===========================//
  //***WEB3MODAL INTEGRATION***//
  //===========================//
  useEffect(() => {
    //***Initiate web3modal***//
    const uauthOptions = {
      clientID: "client_id",
      redirectUri: "http://localhost:3000",
      scope: "openid wallet",
    };
    const providerOptions = {
      //***Injected Wallet***//
      injected: {
        display: {
          logo: MetaMaskLogo,
          type: "injected",
          check: "isMetaMask",
          description: "Connect to your MetaMask Wallet",
        },
        package: true,
      },

      //***Wallet Connect***//
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          alchemyId: process.env.REACT_APP_ALCHEMY_KEY,
          rpc: {
            80001: process.env.REACT_APP_MUMBAI_RPC_URL,
          },
        },
        qrcode: true,
        qrcodeModalOptions: {
          mobileLinks: [
            "metamask",
            "trust",
            "rainbow",
            "argent",
            "imtoken",
            "pillar",
          ],
        },
      },

      //***Coinbase Wallet***//
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

      //***Unstoppable Domains***//
      "custom-uauth": {
        display: UAuthWeb3Modal.display,
        connector: UAuthWeb3Modal.connector,
        package: UAuthSPA,
        options: uauthOptions,
      },
    };

    const newWeb3Modal = new Web3Modal({
      cacheProvider: true,
      // network: "maticmum",
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
    //***Registers the web3modal so the connector has access to it***//
    UAuthWeb3Modal.registerWeb3Modal(newWeb3Modal);

    setWeb3Modal(newWeb3Modal);
  }, []);
  //==========================//
  //==========================//

  //***Requests wallet connection***//
  //***Connects user if they are on the Polygon Mumbai network***//
  const connectWallet = async () => {
    try {
      const web3Proxy = await web3Modal.connect();
      const provider = new ethers.providers.Web3Provider(web3Proxy);
      const accounts = await provider.listAccounts();
      const chainData = await provider.getNetwork();
      setProxy(web3Proxy);
      setProvider(provider);
      if (chainData.chainId !== 80001) {
        return alert(
          "You are currently connected to an unsupported network, please switch to Polygon Mumbai Testnet"
        );
      } else {
        setChainId(chainData.chainId);
        await getUserBalance();
        await getPlayerStatistics();
        setWalletAddress(accounts[0]);
        setAccount(accounts[0]);
        setConnected(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //***Gets user chain balance and DOW token balance***//
  const getUserBalance = async () => {
    if (!provider?.on) return;
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
      await checkClaimed();
      return { formartedNetworkCoinBalance, formartedDOWTokenBalance };
    } catch (err) {
      console.error(err);
    }
  };
  // Get player's statistics
  const getPlayerStatistics = async () => {
    if (!provider?.on) return;
    try {
      const DOWContractInstance = await getContract();
      const playerStats = await DOWContractInstance.checkStreak();
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
    } catch (err) {
      console.log(err);
    }
  };

  //**Starts game**//
  const startGame = async () => {
    setGeneratedValues([]);
    if (userBalance.DOWTokenBalance < 5) {
      alert("Insufficient DOW Tokens, you need at least 5 DOW Tokens to play");
      setLoader(false);
      setLoadingSuccess(false);
    }
    setLoadingSuccess(null);
    setLoader(true);
    getPlayerStatistics();
    let randomNumbers = [];
    const DOWContractInstance = await getContract();
    try {
      const playGame = await DOWContractInstance.startGame();
      const gameData = await playGame.wait();
      randomNumbers = gameData.events[2].args.compNum;
      const convertedValues = randomNumbers.map((randomNumber) =>
        Number(randomNumber)
      );
      setGeneratedValues(convertedValues);
      await getUserBalance();
      setLoader(false);
      setLoadingSuccess(true);
    } catch {
      setLoader(false);
      setLoadingSuccess(false);
    }
  };
  const refreshState = () => {
    setConnected(false);
  };

  const getContract = async () => {
    const signer = provider.getSigner();
    return new Contract(DOWContract, DOW_ABI, signer);
  };

  const disconnectWallet = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  // Airdrop free DOW tokens to new players
  const claimFreeTokens = async () => {
    if (!claimed) {
      try {
        const DOWContractInstance = await getContract();
        await DOWContractInstance.claimFreeTokens();
        await checkClaimed();
        await getUserBalance();
      } catch (err) {
        console.log(err);
      }
    } else {
      return alert("Opps! You already claimed your free tokens");
    }
  };
  const checkClaimed = async () => {
    try {
      const DOWContractInstance = await getContract();

      const claimStatus = await DOWContractInstance.checkClaimed();
      setClaimed(claimStatus);
    } catch (err) {
      console.log(err);
    }
  };

  // Check number of trials it took player to win and reward player
  const checkTrials = async (trial) => {
    const DOWContractInstance = await getContract();

    const trials = await DOWContractInstance.checkTrials(trial);
    trials.wait();
    await getUserBalance();
  };

  const updateConnectedUserData = async () => {
    const accounts = await provider.listAccounts();
    await getUserBalance();
    await getPlayerStatistics();
    setWalletAddress(accounts[0]);
    setAccount(accounts[0]);
    setConnected(true);
  };

  const init = async () => {
    if (provider?.on) {
      try {
        const accounts = await provider.listAccounts();
        if (!accounts.length) return;
        await updateConnectedUserData();
      } catch (err) {
        console.log(err);
      }
    }
  };
  // useEffect(() => {
  //   if (web3Modal.cachedProvider) {
  //     connectWallet();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  useEffect(() => {
    init();
    if (proxy) {
      // Updates user data for connected account when user switches accounts
      const handleAccountChanged = async (accounts) => {
        if (accounts.length) {
          try {
            const networkID = await proxy.request({
              method: "eth_chainId",
            });
            if (Number(networkID) !== 80001) {
              setConnected(false);
              return alert(
                "You are currently connected to an unsupported network, please switch to Polygon Mumbai Testnet"
              );
            } else {
              await updateConnectedUserData();
            }
          } catch (err) {
            console.log(err);
          }
        }
      };
      //Alerts user to switch to a supported network
      const handleChainChanged = async () => {
        const networkID = await proxy.request({
          method: "eth_chainId",
        });
        if (Number(networkID) !== 80001) {
          setConnected(false);
          return alert(
            "You are currently connected to an unsupported network, please switch to Polygon Mumbai Testnet"
          );
        } else {
          await updateConnectedUserData();
        }
      };

      proxy.on("disconnect", disconnectWallet);
      proxy.on("connect", getPlayerStatistics);
      proxy.on("connect", getUserBalance);
      proxy.on("accountsChanged", handleAccountChanged);
      proxy.on("chainChanged", handleChainChanged);

      return () => {
        if (proxy.removeListener) {
          proxy.removeListener("accountsChanged", handleAccountChanged);
          proxy.removeListener("chainChanged", handleChainChanged);
          proxy.removeListener("disconnect", disconnectWallet);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, account]);

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
        claimed={claimed}
        location={location}
      />
      {/* <BrowserRouter> */}
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
              getPlayerStatistics={getPlayerStatistics}
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
      {/* </BrowserRouter> */}
      {/* <Footer /> */}
    </>
  );
};

export default App;
