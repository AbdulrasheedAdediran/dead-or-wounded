import { ethers } from "hardhat";

async function main() {
  const Greeter = await ethers.getContractAt(
    "DOW",
    "0x00B02f1D3b5B75279C2931235bE464688dd5dDC4"
  );
  // const greeter = await Greeter.deploy(
  //   "0x2e9F028395cd1d925e6A8215F0Af1bD30858ef53"
  // );

  // await greeter.deployed();
  await Greeter.transferToCreator("300000000000000000000");
  // console.log(await Greeter.balanceOf('0x30f9A9C1aA282508901b606DEA2D887D4dD072e8'))
  // await greeter.startGame();

  console.log("DOW deployed to:", Greeter.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
