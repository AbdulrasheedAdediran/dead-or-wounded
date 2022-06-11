import { ethers } from "hardhat";

async function main() {
  const VRF = await ethers.getContractAt(
    "VRFv2Consumer",
    "0x73fDB6c756fEF146972eeB277373b1638cc6d215"
  );
  // const VRF = await Greeter.deploy();

  // await VRF.deployed();
  await VRF.requestRandomWords();
  // await VRF.fulfillRandomWords();
  // console.log(VRF.s_randomWords(0));
  // console.log("DOW deployed to:", VRF.address);
  console.log(await VRF.s_requestId());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
