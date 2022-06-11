// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {VRFv2Consumer} from "./VRFv2Consumer.sol";

contract DOW is ERC20 {
    // --------------------------------Variables--------------------------------
    uint256 omega;
    uint256 public randNum;
    address owner;
    VRFv2Consumer vrf;
    uint256[] public compNum;
    address[] players;
    //   address constant VRFaddr = 0x26338299bef45aaa55b9daecab0d0abcb91324fd;
    mapping(address => Player) public PlayerStruct;
    mapping(address => bool) playerAdded;
    mapping(address => bool) claimTokens;
    mapping(address => mapping(uint256 => bool)) playerPlaying;
    // --------------------------------Events --------------------------------
    event PlayerNumbers(uint256[] compNum);

    // --------------------------------Errors--------------------------------
    error NotOwner();
    error InsufficientTokens();
    error AlreadyClaimedFreeTokens();
    error PlayerHasNotPlayed();

    // --------------------------------Structs--------------------------------
    struct Player {
    uint256 gamesPlayed;
    uint256 unclaimedTokens;
    uint64 gamesLost;
    uint64 currentWinStreak;
    uint64 maxWinStreak;
    uint64 gamesWon;
    }

    // --------------------------------Constructor--------------------------------
    constructor(address VRFaddress) ERC20("Dead or Wounded", "DOW") {
        owner = msg.sender;
        vrf = VRFv2Consumer(VRFaddress);
        uint256 totalSupply = 10000000000000000000000000000;
        _mint(address(this), totalSupply);
    }

    // --------------------------------Modifiers--------------------------------

    modifier onlyOwner() {
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    // --------------------------------Functions--------------------------------

    /**
     * return the msg.data of this call.
     * if the call came through our trusted forwarder, then the real sender was appended as the last 20 bytes
     * of the msg.data - so this method will strip those 20 bytes off.
     * otherwise (if the call was made directly and not through the forwarder), return `msg.data`
     * should be used in the contract instead of msg.data, where this difference matters.
     */
    // --------------------------------VRF Method--------------------------------
    function generateRandomNumber() public {
        vrf.requestRandomWords();
        randNum = vrf.s_requestId();
    }

    // VRF Address = 0x2e9F028395cd1d925e6A8215F0Af1bD30858ef53
    // contract address 0xF74FA5d40B3cc4aDF0665e9bF278486a75De6918

    function vrfNumbers() internal {
        uint256 _rand = randNum >> randomNumber();
        bool matches = false;
        for (uint256 i = 0; i < compNum.length; i++) {
            if (compNum[i] == _rand % 10) {
                matches = true;
                break;
            }
        }
        if (!matches) {
            compNum.push(_rand % 10);
        }
    }

    function randomNumber() internal returns (uint256) {
        uint256 mod = 10;
        omega += 1;
        return
            uint256(
                keccak256(abi.encodePacked(block.timestamp, omega, msg.sender))
            ) % mod;
    }

    function clearArray() internal {
        while (compNum.length > 0) {
            compNum.pop();
        }
    }

    function startGame() external returns (uint256[] memory playerNumbers) {
        generateRandomNumber();
        if (!playerAdded[msg.sender]) {
            playerAdded[msg.sender] = true;
            players.push(msg.sender);
        }
        Player storage o = PlayerStruct[msg.sender];
        if (balanceOf(msg.sender) < 5000000000000000000)
            revert InsufficientTokens();
        _transfer(msg.sender, address(this), 5000000000000000000);
        playerNumbers = new uint256[](4);
        while (compNum.length < 4) {
            vrfNumbers();
        }
        playerNumbers[0] = uint256(compNum[0]);
        playerNumbers[1] = uint256(compNum[1]);
        playerNumbers[2] = uint256(compNum[2]);
        playerNumbers[3] = uint256(compNum[3]); 
        clearArray();
        playerPlaying[msg.sender][o.gamesPlayed] = true;
        emit PlayerNumbers(playerNumbers);
    }

//     function checkTrials (uint8 trial) external {
//     Player storage o = PlayerStruct[msg.sender];
//     if(playerPlaying[msg.sender][o.gamesPlayed] == false) revert PlayerHasNotPlayed();
//      o.gamesPlayed++;
//     if (trial == 1) {
//       o.currentWinStreak++;
//       o.gamesWon++;
//       o.unclaimedTokens += 20000000000000000000;
//     } else if (trial == 2) {
//       o.currentWinStreak++;
//       o.gamesWon++;
//       o.unclaimedTokens+=20000000000000000000;
//     } else if (trial == 3) {
//       o.currentWinStreak++;
//       o.gamesWon++;
//       o.unclaimedTokens += 20000000000000000000;
//     } else if (trial == 4) {
//       o.currentWinStreak++;
//       o.gamesWon++;
//       o.unclaimedTokens += 12000000000000000000;
//     } else if (trial == 5) {
//       o.currentWinStreak++;
//       o.gamesWon++;
//       o.unclaimedTokens += 12000000000000000000;
//     } else if (trial == 6) {
//       o.currentWinStreak++;
//       o.gamesWon++;
//       o.unclaimedTokens += 7000000000000000000;
//     } else if (trial == 7) {
//       o.currentWinStreak++;
//       o.gamesWon++;
//       o.unclaimedTokens += 7000000000000000000;
//     }else if (trial == 8) {
//       o.currentWinStreak = 0;
//       o.gamesLost++;
//       o.unclaimedTokens += 7000000000000000000;
//     }
//     if(o.currentWinStreak >= o.maxWinStreak){
//       o.maxWinStreak = o.currentWinStreak;
//     }
//   }

  function claimWonTokens (uint256 _amount) external {
    if( _amount < 0) revert InsufficientTokens();
    require (playerAdded[msg.sender], "Player not Found");
    _transfer(address(this),msg.sender, _amount);
  }


//   function LeaderBoard () external view returns (PlayerScore[] memory leaderBoard) {
//     leaderBoard = new PlayerScore[](players.length);
//     for (uint i = 0; i < players.length; i++) {
//       Player storage o = PlayerStruct[players[i]];
//       leaderBoard[i].playerAddress = players[i];
//       leaderBoard[i].wins = o.gamesWon;
//     }
//   }

  function claimFreeTokens() external {
    if(claimTokens[msg.sender]) revert AlreadyClaimedFreeTokens();
     claimTokens[msg.sender] = true;
    _transfer(address(this), msg.sender, 100000000000000000000);
  }

  function transferToCreator(uint _amount) external{
    if(msg.sender != owner) revert NotOwner();
    _transfer(address(this), owner, _amount);
  }

}

