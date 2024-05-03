import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomiclabs/hardhat-web3'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import dotenv from 'dotenv'
import { Prepayment__factory } from '@bisonai/orakl-contracts'

dotenv.config()

let commonConfig = {}
if (process.env.PRIV_KEY) {
  commonConfig = {
    gas: 5_000_000,
    accounts: [process.env.PRIV_KEY]
  }
} else {
  commonConfig = {
    gas: 5_000_000,
    accounts: {
      mnemonic: process.env.MNEMONIC || ''
    }
  }
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
      url: process.env.PROVIDER || 'https://api.baobab.klaytn.net:8651',
      chainId: 1001,
      ...commonConfig,
      gasPrice: 250_000_000_000
    },
    cypress: {
      url: process.env.PROVIDER || 'https://public-en-cypress.klaytn.net',
      ...commonConfig,
      gasPrice: 250_000_000_000
    }
  },
  namedAccounts: {
    deployer: {
      default: 0
    },
    prepayment: {
      baobab: '0x8d3A1663d10eEb0bC9C9e537e1BBeA69383194e7',
      cypress: '0xc2C88492Cf7e5240C3EB49353539E75336960600'
    },
    vrfCoordinator: {
      baobab: '0xDA8c0A00A372503aa6EC80f9b29Cc97C454bE499',
      cypress: '0x3F247f70DC083A2907B8E76635986fd09AA80EFb'
    }
  }
}

task('address', 'Convert mnemonic to address')
  .addParam('mnemonic', "The account's mnemonic")
  .setAction(async (taskArgs, hre) => {
    const wallet = hre.ethers.Wallet.fromMnemonic(taskArgs.mnemonic)
    console.log(wallet.address)
  })

task('createAccount', 'Create new account').setAction(async (taskArgs, hre) => {
  const { prepayment: prepaymentAddress } = await hre.getNamedAccounts()
  const prepayment = await ethers.getContractAt(Prepayment__factory.abi, prepaymentAddress)

  const txReceipt = await (await prepayment.createAccount()).wait()
  const accId = txReceipt.events[0].args.accId.toString()

  console.log(`Account created with ID: ${accId}`)
})

task('cancelAccount', 'Cancel account')
  .addParam('to', 'Account address')
  .addOptionalParam('accountId', 'Account Id')
  .setAction(async (taskArgs, hre) => {
    const { prepayment: prepaymentAddress } = await hre.getNamedAccounts()
    const prepayment = await ethers.getContractAt(Prepayment__factory.abi, prepaymentAddress)

    const accId = taskArgs.accountId || process.env.ACC_ID
    const to = taskArgs.amount

    const txReceipt = await (await prepayment.cancelAccount(accId, to)).wait()

    console.log(txReceipt)
    console.log(`Account canceled with ID: ${accId}`)
  })

task('deposit', 'Deposit $KLAY to account')
  .addParam('amount', 'The amount of $KLAY')
  .addOptionalParam('accountId', 'Account Id')
  .setAction(async (taskArgs, hre) => {
    const accId = taskArgs.accountId || process.env.ACC_ID
    const klayAmount = taskArgs.amount

    if (accId) {
      const { prepayment: prepaymentAddress } = await hre.getNamedAccounts()
      const prepayment = await ethers.getContractAt(Prepayment__factory.abi, prepaymentAddress)
      const amount = ethers.utils.parseEther(klayAmount)
      const txReceipt = await (await prepayment.deposit(accId, { value: amount })).wait()
      const balance = txReceipt.events[0].args.newBalance.toString()
      const newBalance = ethers.utils.formatEther(balance)

      console.log(`Deposited ${klayAmount} $KLAY to account ${accId}`)
      console.log(`Account balance after deposit: ${newBalance} $KLAY`)
    } else {
      console.log(`Prepayment accountId is not defined`)
    }
  })

task('withdraw', 'Withdraw $KLAY from account')
  .addParam('amount', 'The amount of $KLAY')
  .addOptionalParam('accountId', 'Account Id')
  .setAction(async (taskArgs, hre) => {
    const accId = taskArgs.accountId || process.env.ACC_ID
    const klayAmount = taskArgs.amount

    if (accId) {
      const { prepayment: prepaymentAddress } = await hre.getNamedAccounts()
      const prepayment = await ethers.getContractAt(Prepayment__factory.abi, prepaymentAddress)
      const amount = ethers.utils.parseEther(klayAmount)
      const txReceipt = await (await prepayment.withdraw(accId, amount)).wait()
      const balance = txReceipt.events[0].args.newBalance.toString()
      const newBalance = ethers.utils.formatEther(balance)

      console.log(`Withdrew ${klayAmount} $KLAY to account ${accId}`)
      console.log(`Account balance after withdrawal: ${newBalance} $KLAY`)
    } else {
      console.log(`Prepayment accountId is not defined`)
    }
  })

task('addConsumer', 'Add consumer')
  .addOptionalParam('consumer', 'Consumer Address')
  .addOptionalParam('accountId', 'Account Id')
  .setAction(async (taskArgs, hre) => {
    const accId = taskArgs.accountId || process.env.ACC_ID
    const consumerAddress = taskArgs.consumer || (await ethers.getContract('VRFConsumer')).address

    if (accId && consumerAddress) {
      const { prepayment: prepaymentAddress } = await hre.getNamedAccounts()
      const prepayment = await ethers.getContractAt(Prepayment__factory.abi, prepaymentAddress)
      await (await prepayment.addConsumer(accId, consumerAddress)).wait()

      console.log(`Added consumer ${consumerAddress} to prepayment account`)
    } else {
      if (!accId) console.log(`Prepayment accountId is not defined`)
      if (!consumerAddress) console.log(`Consumer Address is not defined`)
    }
  })

task('removeConsumer', 'Remove consumer')
  .addOptionalParam('consumer', 'Consumer Address')
  .addOptionalParam('accountId', 'Account Id')
  .setAction(async (taskArgs, hre) => {
    const accId = taskArgs.accountId || process.env.ACC_ID
    const consumerAddress = taskArgs.consumer || (await ethers.getContract('VRFConsumer')).address

    if (accId && consumerAddress) {
      const { prepayment: prepaymentAddress } = await hre.getNamedAccounts()
      console.log(prepaymentAddress)
      const prepayment = await ethers.getContractAt(Prepayment__factory.abi, prepaymentAddress)
      await (await prepayment.removeConsumer(accId, consumerAddress)).wait()

      console.log(`Removed consumer ${consumerAddress} to prepayment account`)
    } else {
      if (!accId) console.log(`Prepayment accountId is not defined`)
      if (!consumerAddress) console.log(`Consumer Address is not defined`)
    }
  })

export default config
