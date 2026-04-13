// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IVeinZeroRewardToken {
    function mint(address to, uint256 amount) external;
    function burnFrom(address account, uint256 value) external;
}

interface IVeinZeroAgentNFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function safeMint(address to, string calldata metadataURI) external returns (uint256 tokenId);
}

contract VeinZeroGame is Ownable, Pausable, ReentrancyGuard {
    using Address for address payable;

    enum UpgradePath {
        Power,
        Efficiency,
        Resilience
    }

    struct AgentState {
        uint32 power;
        uint32 efficiency;
        uint32 resilience;
        uint32 xp;
        uint32 energy;
        uint32 wins;
        uint32 losses;
        uint16 tier;
        uint16 upgrades;
        uint64 lastActionAt;
        uint256 pendingRewards;
        uint256 totalMined;
        uint256 totalClaimed;
    }

    uint256 public constant MAX_ENERGY = 100;
    uint256 public constant STARTING_STAT = 12;
    uint256 public constant STARTING_REWARD = 0;

    IVeinZeroRewardToken public immutable rewardToken;
    IVeinZeroAgentNFT public immutable agentNFT;

    uint256 public mintPrice = 0.001 ether;
    uint256 public actionCooldown = 10 minutes;
    uint256 public mineBaseReward = 7 ether;
    uint256 public duelWinReward = 10 ether;
    uint256 public upgradeBaseCost = 25 ether;
    address public treasury;
    uint256 public totalNetworkMined;

    mapping(uint256 agentId => AgentState) public agentStates;
    mapping(address owner => mapping(address operator => bool approved)) public automationApproval;

    event AgentMinted(address indexed owner, uint256 indexed agentId, string metadataURI);
    event AgentMined(address indexed caller, uint256 indexed agentId, uint256 reward, uint256 energyRemaining);
    event AgentRested(address indexed caller, uint256 indexed agentId, uint256 energyRecovered);
    event AgentUpgraded(address indexed caller, uint256 indexed agentId, UpgradePath path, uint256 cost, uint16 tier);
    event RewardsClaimed(address indexed owner, uint256 indexed agentId, uint256 amount);
    event AgentDueled(
        uint256 indexed attackerId,
        uint256 indexed defenderId,
        uint256 indexed winnerId,
        uint256 reward
    );
    event AutomationOperatorUpdated(address indexed owner, address indexed operator, bool approved);
    event TreasuryUpdated(address indexed treasury);
    event MintPriceUpdated(uint256 mintPrice);
    event EconomyUpdated(uint256 mineBaseReward, uint256 duelWinReward, uint256 upgradeBaseCost, uint256 actionCooldown);

    error InvalidPayment();
    error NotAuthorized();
    error AgentNotReady();
    error InsufficientEnergy();
    error NoPendingRewards();
    error InvalidTreasury();
    error InvalidOpponent();

    constructor(address admin, address rewardTokenAddress, address agentNFTAddress, address treasuryAddress)
        Ownable(admin)
    {
        if (treasuryAddress == address(0)) revert InvalidTreasury();

        rewardToken = IVeinZeroRewardToken(rewardTokenAddress);
        agentNFT = IVeinZeroAgentNFT(agentNFTAddress);
        treasury = treasuryAddress;
    }

    modifier onlyController(uint256 agentId) {
        address owner = agentNFT.ownerOf(agentId);
        if (msg.sender != owner && !automationApproval[owner][msg.sender]) revert NotAuthorized();
        _;
    }

    function mintStarterAgent(string calldata metadataURI) external payable whenNotPaused nonReentrant returns (uint256 agentId) {
        if (msg.value != mintPrice) revert InvalidPayment();

        agentId = agentNFT.safeMint(msg.sender, metadataURI);
        agentStates[agentId] = AgentState({
            power: uint32(STARTING_STAT),
            efficiency: uint32(STARTING_STAT),
            resilience: uint32(STARTING_STAT),
            xp: 0,
            energy: uint32(MAX_ENERGY),
            wins: 0,
            losses: 0,
            tier: 1,
            upgrades: 0,
            lastActionAt: uint64(block.timestamp),
            pendingRewards: STARTING_REWARD,
            totalMined: 0,
            totalClaimed: 0
        });

        payable(treasury).sendValue(msg.value);
        emit AgentMinted(msg.sender, agentId, metadataURI);
    }

    function setAutomationOperator(address operator, bool approved) external {
        automationApproval[msg.sender][operator] = approved;
        emit AutomationOperatorUpdated(msg.sender, operator, approved);
    }

    function mine(uint256 agentId) external whenNotPaused nonReentrant onlyController(agentId) {
        AgentState storage state = agentStates[agentId];
        _refreshEnergy(state);
        _requireActionReady(state);

        uint256 energyCost = _mineEnergyCost(state);
        if (state.energy < energyCost) revert InsufficientEnergy();

        state.energy -= uint32(energyCost);
        uint256 reward = previewMineReward(agentId);
        state.pendingRewards += reward;
        state.totalMined += reward;
        state.xp += 15;
        state.lastActionAt = uint64(block.timestamp);
        totalNetworkMined += reward;

        emit AgentMined(msg.sender, agentId, reward, state.energy);
    }

    function rest(uint256 agentId) external whenNotPaused nonReentrant onlyController(agentId) {
        AgentState storage state = agentStates[agentId];
        _refreshEnergy(state);
        _requireActionReady(state);

        uint256 restored = 20 + (state.resilience / 2);
        uint256 newEnergy = state.energy + restored;
        state.energy = uint32(newEnergy > MAX_ENERGY ? MAX_ENERGY : newEnergy);
        state.xp += 5;
        state.lastActionAt = uint64(block.timestamp);

        emit AgentRested(msg.sender, agentId, restored);
    }

    function upgrade(uint256 agentId, UpgradePath path) external whenNotPaused nonReentrant onlyController(agentId) {
        AgentState storage state = agentStates[agentId];
        address owner = agentNFT.ownerOf(agentId);
        uint256 cost = upgradeCost(agentId);

        rewardToken.burnFrom(owner, cost);

        if (path == UpgradePath.Power) {
            state.power += uint32(4 + state.tier);
        } else if (path == UpgradePath.Efficiency) {
            state.efficiency += uint32(4 + state.tier);
        } else {
            state.resilience += uint32(4 + state.tier);
        }

        state.upgrades += 1;
        state.tier = uint16(1 + (state.upgrades / 3));
        state.xp += 25;

        emit AgentUpgraded(msg.sender, agentId, path, cost, state.tier);
    }

    function claimRewards(uint256 agentId) external whenNotPaused nonReentrant onlyController(agentId) {
        AgentState storage state = agentStates[agentId];
        address owner = agentNFT.ownerOf(agentId);
        uint256 amount = state.pendingRewards;
        if (amount == 0) revert NoPendingRewards();

        state.pendingRewards = 0;
        state.totalClaimed += amount;
        rewardToken.mint(owner, amount);

        emit RewardsClaimed(owner, agentId, amount);
    }

    function duel(uint256 attackerId, uint256 defenderId)
        external
        whenNotPaused
        nonReentrant
        onlyController(attackerId)
        returns (uint256 winnerId)
    {
        if (attackerId == defenderId) revert InvalidOpponent();
        if (agentNFT.ownerOf(attackerId) == agentNFT.ownerOf(defenderId)) revert InvalidOpponent();

        AgentState storage attacker = agentStates[attackerId];
        AgentState storage defender = agentStates[defenderId];

        _refreshEnergy(attacker);
        _refreshEnergy(defender);
        _requireActionReady(attacker);
        _requireActionReady(defender);

        uint256 duelEnergyCost = 25;
        if (attacker.energy < duelEnergyCost || defender.energy < duelEnergyCost) revert InsufficientEnergy();

        attacker.energy -= uint32(duelEnergyCost);
        defender.energy -= uint32(duelEnergyCost);

        uint256 attackerScore = _battleScore(attacker) + 3;
        uint256 defenderScore = _battleScore(defender);

        AgentState storage winner = attackerScore > defenderScore ? attacker : defender;
        AgentState storage loser = attackerScore > defenderScore ? defender : attacker;
        winnerId = attackerScore > defenderScore ? attackerId : defenderId;

        winner.pendingRewards += duelWinReward;
        winner.wins += 1;
        winner.xp += 20;
        loser.losses += 1;
        loser.xp += 8;
        attacker.lastActionAt = uint64(block.timestamp);
        defender.lastActionAt = uint64(block.timestamp);

        emit AgentDueled(attackerId, defenderId, winnerId, duelWinReward);
    }

    function upgradeCost(uint256 agentId) public view returns (uint256) {
        AgentState storage state = agentStates[agentId];
        return upgradeBaseCost * (state.upgrades + 1) * state.tier;
    }

    function previewMineReward(uint256 agentId) public view returns (uint256) {
        AgentState storage state = agentStates[agentId];
        uint256 numerator = 100 + (state.power * 5) + (state.efficiency * 4) + (state.tier * 30);
        return (mineBaseReward * numerator) / 100;
    }

    function setMintPrice(uint256 newMintPrice) external onlyOwner {
        mintPrice = newMintPrice;
        emit MintPriceUpdated(newMintPrice);
    }

    function setTreasury(address newTreasury) external onlyOwner {
        if (newTreasury == address(0)) revert InvalidTreasury();
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }

    function setEconomy(uint256 newMineBaseReward, uint256 newDuelWinReward, uint256 newUpgradeBaseCost, uint256 newActionCooldown)
        external
        onlyOwner
    {
        mineBaseReward = newMineBaseReward;
        duelWinReward = newDuelWinReward;
        upgradeBaseCost = newUpgradeBaseCost;
        actionCooldown = newActionCooldown;
        emit EconomyUpdated(newMineBaseReward, newDuelWinReward, newUpgradeBaseCost, newActionCooldown);
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function _requireActionReady(AgentState storage state) internal view {
        if (block.timestamp < state.lastActionAt + actionCooldown) revert AgentNotReady();
    }

    function _refreshEnergy(AgentState storage state) internal {
        uint256 elapsed = block.timestamp - state.lastActionAt;
        if (elapsed < 1 hours) return;

        uint256 recovered = (elapsed / 1 hours) * (4 + (state.resilience / 6));
        uint256 newEnergy = state.energy + recovered;
        state.energy = uint32(newEnergy > MAX_ENERGY ? MAX_ENERGY : newEnergy);
    }

    function _mineEnergyCost(AgentState storage state) internal view returns (uint256) {
        uint256 resilienceDiscount = state.resilience / 8;
        return resilienceDiscount >= 12 ? 8 : 20 - resilienceDiscount;
    }

    function _battleScore(AgentState storage state) internal view returns (uint256) {
        return
            (state.power * 3) +
            (state.efficiency * 2) +
            (state.resilience * 2) +
            (state.tier * 15) +
            (state.xp / 10);
    }
}
