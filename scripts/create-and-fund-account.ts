import { ethers } from 'hardhat'
import { Prepayment__factory } from '@bisonai-cic/icn-contracts'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const ACC_ID = process.env.ACC_ID
  if (!ACC_ID) {
    console.log('Generating new prepayment account ID')
    const { prepayment: prepaymentAddress } = await hre.getNamedAccounts()
    const prepayment = await ethers.getContractAt(Prepayment__factory.abi, prepaymentAddress)

    // Create a new account. One address can make many accounts.
    const txReceipt = await (await prepayment.createAccount()).wait()
    const accId = txReceipt.events[0].args.accId.toString()
    console.log(`Account ID: ${accId}`)

    // Deposit 1 KLAY
    const klayAmount = '1'
    const amount = ethers.utils.parseEther(klayAmount)
    await (await prepayment.deposit(accId, { value: amount })).wait()
    console.log(`Deposited ${klayAmount} KLAY to account ID ${accId}`)

    // Add VRFConsumer as consumer of Prepayment account
    const vrfConsumerAddress = (await ethers.getContract('VRFConsumer')).address
    await (await prepayment.addConsumer(accId, vrfConsumerAddress)).wait()
    console.log(`Added VRFConsumer ${vrfConsumerAddress} to prepayment account`)
  } else {
    console.log(`Prepayment account ID already defined: ${ACC_ID}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
