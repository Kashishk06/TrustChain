import { ethers } from "hardhat";

async function main() {
  const TrustChain = await ethers.getContractFactory("TrustChain");
  const trustChain = await TrustChain.deploy();

  await trustChain.waitForDeployment();

  console.log("✅ TrustChain deployed to:", await trustChain.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
