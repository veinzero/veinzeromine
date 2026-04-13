import { expect } from "chai";
import { ethers } from "hardhat";

describe("VeinZeroGame", () => {
  async function deployFixture() {
    const [owner, player, rival, operator, treasury] = await ethers.getSigners();

    const tokenFactory = await ethers.getContractFactory("VeinZeroRewardToken");
    const token = await tokenFactory.deploy(owner.address);
    await token.waitForDeployment();

    const nftFactory = await ethers.getContractFactory("VeinZeroAgentNFT");
    const nft = await nftFactory.deploy(owner.address);
    await nft.waitForDeployment();

    const gameFactory = await ethers.getContractFactory("VeinZeroGame");
    const game = await gameFactory.deploy(
      owner.address,
      await token.getAddress(),
      await nft.getAddress(),
      treasury.address
    );
    await game.waitForDeployment();

    const tokenMinterRole = await token.MINTER_ROLE();
    const nftMinterRole = await nft.MINTER_ROLE();
    await (await token.grantRole(tokenMinterRole, await game.getAddress())).wait();
    await (await nft.grantRole(nftMinterRole, await game.getAddress())).wait();

    return { owner, player, rival, operator, treasury, token, nft, game };
  }

  async function advanceCooldown() {
    await ethers.provider.send("evm_increaseTime", [601]);
    await ethers.provider.send("evm_mine", []);
  }

  it("mints a starter agent with default stats", async () => {
    const { player, game } = await deployFixture();

    await expect(
      game.connect(player).mintStarterAgent("ipfs://veinzero/agent-1.json", {
        value: ethers.parseEther("0.001")
      })
    ).to.emit(game, "AgentMinted");

    const state = await game.agentStates(1);
    expect(state.power).to.equal(12);
    expect(state.efficiency).to.equal(12);
    expect(state.resilience).to.equal(12);
    expect(state.energy).to.equal(100);
    expect(state.tier).to.equal(1);
  });

  it("mines and lets the owner claim rewards", async () => {
    const { player, token, game } = await deployFixture();

    await game.connect(player).mintStarterAgent("ipfs://veinzero/agent-1.json", {
      value: ethers.parseEther("0.001")
    });

    await advanceCooldown();
    await expect(game.connect(player).mine(1)).to.emit(game, "AgentMined");

    const stateAfterMine = await game.agentStates(1);
    expect(stateAfterMine.pendingRewards).to.be.greaterThan(0n);

    await expect(game.connect(player).claimRewards(1)).to.emit(game, "RewardsClaimed");
    expect(await token.balanceOf(player.address)).to.equal(stateAfterMine.pendingRewards);
  });

  it("burns rewards to upgrade an agent", async () => {
    const { owner, player, token, game } = await deployFixture();

    await game.connect(player).mintStarterAgent("ipfs://veinzero/agent-1.json", {
      value: ethers.parseEther("0.001")
    });
    await game.connect(owner).setEconomy(
      ethers.parseEther("7"),
      ethers.parseEther("10"),
      ethers.parseEther("10"),
      10 * 60
    );

    await advanceCooldown();
    await game.connect(player).mine(1);
    await game.connect(player).claimRewards(1);

    const cost = await game.upgradeCost(1);
    const balanceBefore = await token.balanceOf(player.address);
    await token.connect(player).approve(await game.getAddress(), cost);

    await expect(game.connect(player).upgrade(1, 0)).to.emit(game, "AgentUpgraded");

    const state = await game.agentStates(1);
    const balanceAfter = await token.balanceOf(player.address);
    expect(state.power).to.be.greaterThan(12);
    expect(balanceBefore - balanceAfter).to.equal(cost);
  });

  it("supports automation operators for autonomous play", async () => {
    const { player, operator, game } = await deployFixture();

    await game.connect(player).mintStarterAgent("ipfs://veinzero/agent-1.json", {
      value: ethers.parseEther("0.001")
    });

    await game.connect(player).setAutomationOperator(operator.address, true);
    await advanceCooldown();

    await expect(game.connect(operator).mine(1)).to.emit(game, "AgentMined");
  });

  it("resolves duels between rival agents", async () => {
    const { player, rival, game } = await deployFixture();

    await game.connect(player).mintStarterAgent("ipfs://veinzero/agent-1.json", {
      value: ethers.parseEther("0.001")
    });
    await game.connect(rival).mintStarterAgent("ipfs://veinzero/agent-2.json", {
      value: ethers.parseEther("0.001")
    });

    await advanceCooldown();
    await expect(game.connect(player).duel(1, 2)).to.emit(game, "AgentDueled");

    const a = await game.agentStates(1);
    const b = await game.agentStates(2);
    expect(a.wins + b.wins).to.equal(1);
    expect(a.losses + b.losses).to.equal(1);
  });
});
