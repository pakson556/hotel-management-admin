import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  console.log("Deploying HotelBooking contract...");
  console.log("Network:", network.name);

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const contract = await ethers.deployContract("HotelBooking");
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("HotelBooking deployed to:", address);
  console.log(
    "\nUpdate CONTRACT_ADDRESS in src/blockchain/contract.js to:",
    address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
