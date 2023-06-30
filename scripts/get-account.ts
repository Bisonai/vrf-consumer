import { ethers } from 'hardhat'
import { Prepayment__factory } from '@bisonai/orakl-contracts'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const ACC_ID = process.env.ACC_ID
  if (!ACC_ID) {
    console.error('ACC_ID not defined in .env file')
  } else {
    const { prepayment: prepaymentAddress } = await hre.getNamedAccounts()
    const prepayment = await ethers.getContractAt(Prepayment__factory.abi, prepaymentAddress)

    const { balance, reqCount, owner, consumers } = await prepayment.getAccount(ACC_ID)
    const amountKlay = balance / Number(ethers.utils.parseEther('1.0'))
    console.log(`balance:\t${balance}`)
    console.log(`balance:\t${amountKlay} Klay`)
    console.log(`reqCount:\t${reqCount}`)
    console.log(`owner:\t\t${owner}`)
    console.log(`consumers:\t${consumers}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
