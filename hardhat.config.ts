import {task} from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import '@nomiclabs/hardhat-ethers';
import 'hardhat-deploy';
import '@typechain/hardhat';
import {HardhatUserConfig} from 'hardhat/types';
import "solidity-coverage";
import "@nomiclabs/hardhat-etherscan";

const secret = require("./secret.json");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: "0.8.4",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 100000
                    }
                }
            },
            {
                version: "0.7.6",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 100000
                    }
                }
            }
        ],
    },
    namedAccounts: {
        owner: 0,
        user1: 1,
        user2: 2,
        user3: 3,
        user4: 4,
        user5: 5,
    },
    networks: {
        hardhat: {
            mining: {
                auto: true
            }
        },
        bsc_test: {
            url: secret.url,
            accounts: [secret.key],
            timeout: 120000
        },
        kovan: {
            url: secret.url_kovan,
            accounts: [secret.key],
            timeout: 120000
        },
        ropsten: {
            url: secret.url_ropsten,
            accounts: [secret.key],
            timeout: 120000,
            gas: 2100000,
            gasPrice: 8000000000
        },
        mumbai: {
            url: secret.url_mumbai,
            accounts: [secret.key],
            timeout: 120000,
        },
        optimistic_kovan: {
            url: secret.url_optimistic_kovan,
            accounts: [secret.key],
            timeout: 120000,
        },
        arbitrum_rinkeby: {
            url: secret.url_arbitrum_rinkeby,
            accounts: [secret.key],
            timeout: 120000,
        },
        fantom_tesnet : {
            url: secret.url_fantom_tesnet,
            accounts: [secret.key],
            timeout: 120000,
        },
        avax_tesnet : {
            url: secret.url_fuji_testnet,
            accounts: [secret.key],
            timeout: 120000,
        }

    },
    etherscan: {
        apiKey: secret.apiKey
    },
}
export default config;

