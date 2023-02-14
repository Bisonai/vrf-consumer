import { HardhatUserConfig } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-web3'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import dotenv from 'dotenv'

dotenv.config()

const commonConfig = {
  gas: 5_000_000,
  accounts:[process.env.PRIV_KEY??""]
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.16',
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000
      }
    }
  },

  networks: {
    localhost: {
      gas: 1_400_000,
      gasPrice: 250_000_000_000
    },
    baobab: {
      url: 'https://api.baobab.klaytn.net:8651',
      chainId: 1001,
      ...commonConfig,
      gasPrice: 250_000_000_000
    },
    cypress: {
      url: 'https://public-en-cypress.klaytn.net',
      ...commonConfig,
      gasPrice: 250_000_000_000
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
    prepayment: {
      baobab: '0xE22e67F7ce4b6FA9E3ABCB6125Fb53Cb577B34Ef'
    },
    vrfCoordinator: {
      baobab: '0x7cb70669dB89f6d20C47ecF8f010F477722D1E22'
    }
  }
}

export default config
