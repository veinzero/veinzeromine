import { config as loadEnv } from "dotenv";
import { ethers } from "hardhat";

loadEnv({ path: "../../.env" });
loadEnv();

async function main() {
  const [deployer] = await ethers.getSigners();
  const treasury = process.env.TREASURY_ADDRESS ?? deployer.address;

  console.log(`Deploying VeinZero with ${deployer.address}`);
  console.log(`Treasury: ${treasury}`);

  const tokenFactory = await ethers.getContractFactory("VeinZeroRewardToken");
  const token = await tokenFactory.deploy(deployer.address);
  await token.waitForDeployment();

  const nftFactory = await ethers.getContractFactory("VeinZeroAgentNFT");
  const nft = await nftFactory.deploy(deployer.address);
  await nft.waitForDeployment();

  const gameFactory = await ethers.getContractFactory("VeinZeroGame");
  const game = await gameFactory.deploy(
    deployer.address,
    await token.getAddress(),
    await nft.getAddress(),
    treasury
  );
  await game.waitForDeployment();

  const minterRole = await token.MINTER_ROLE();
  const nftMinterRole = await nft.MINTER_ROLE();

  await (await token.grantRole(minterRole, await game.getAddress())).wait();
  await (await nft.grantRole(nftMinterRole, await game.getAddress())).wait();

  console.log("Deployment complete");
  console.log(`TOKEN_CONTRACT_ADDRESS=${await token.getAddress()}`);
  console.log(`AGENT_NFT_ADDRESS=${await nft.getAddress()}`);
  console.log(`GAME_CONTRACT_ADDRESS=${await game.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
