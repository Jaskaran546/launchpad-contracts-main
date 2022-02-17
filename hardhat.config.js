require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("hardhat-deploy-ethers")
require('hardhat-abi-exporter');
//require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-web3");
require("solidity-coverage");
require('hardhat-spdx-license-identifier');
require('hardhat-contract-sizer');
require('hardhat-deploy');

const privateKey = process.env.PRIVATE_KEY;





// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.11",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    }
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    staker: {
      default: 1,
    },
    alice: {
      default: 2,
    }
  },
  networks: {
    bsctestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      accounts: [`0x${privateKey}`],
      // gasPrice: 500000000
    },
    bscmainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      accounts: [`0x${privateKey}`],
     // gasPrice: 5000000000
    },
    local: {
      url: 'http://127.0.0.1:8545/',
      allowUnlimitedContractSize: true,
      accounts: ['0xc13dc6ee0769c578ebdecff5b09cb1481b955d31bd41dbfa7c151026a0abf224'],
      blockGasLimit: 120000000,
    }
  },

  spdxLicenseIdentifier: {
    overwrite: true,
    runOnCompile: true,
  },
  paths: {
    deploy: 'deploy',
    deployments: 'deployments',
    imports: 'imports'
  },
  etherscan: {
    apiKey: "GHX9QXRVQS47XV9YQEPERGCBKZJZ7M6X7G"
  }
};

