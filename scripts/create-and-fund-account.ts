import { ethers } from 'hardhat'
import { Prepayment__factory } from '@bisonai-cic/icn-contracts'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const ACC_ID = process.env.ACC_ID
  if (!ACC_ID) {
    console.log('Generating new Prepayment account ID')
    const { prepayment: prepaymentAddress } = await hre.getNamedAccounts()
    const prepayment = await ethers.getContractAt(Prepayment__factory.abi, prepaymentAddress)

    // Create a new account. One address can make many accounts.
    const txReceipt = await (await prepayment.createAccount()).wait()
    const accId = txReceipt.events[0].args.accId.toString()
    console.log(`Account ID: ${accId}`)

    // Deposit 1 KLAY
    const amount = ethers.utils.parseEther('1.0')
    await (await prepayment.deposit({ value: amount })).wait()
  } else {
    console.log(`Prepayment account ID already defined: ${ACC_ID}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
