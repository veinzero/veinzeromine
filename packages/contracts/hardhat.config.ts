import "@nomicfoundation/hardhat-toolbox";
import { config as loadEnv } from "dotenv";
import { HardhatUserConfig } from "hardhat/config";

loadEnv({ path: "../../.env" });
loadEnv();

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.BASE_SEPOLIA_RPC_URL;
const basescanApiKey = process.env.BASESCAN_API_KEY;

const networks: HardhatUserConfig["networks"] = {
  hardhat: {}
};

if (privateKey && rpcUrl) {
  networks.baseSepolia = {
    url: rpcUrl,
    accounts: [privateKey]
  };
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks,
  etherscan: basescanApiKey ? {
    apiKey: {
      baseSepolia: basescanApiKey
    }
  } : undefined
};

export default config;
