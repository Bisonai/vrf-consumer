import { ethers } from 'hardhat'
import dotenv from 'dotenv'
import { getKeyHash } from './utils'

dotenv.config()

async function main() {
  const ACC_ID = process.env.ACC_ID
  if (!ACC_ID) {
    console.error('ACC_ID not defined in .env file')
  } else {
    const vrfConsumer = await ethers.getContract('VRFConsumer')

    const keyHash = getKeyHash()
    const callbackGasLimit = 500_000
    const numWords = 1

    const txReceipt = await (
      await vrfConsumer.requestRandomWords(keyHash, ACC_ID, callbackGasLimit, numWords)
    ).wait()
    console.log(txReceipt)
    console.log('Requested random words using prepayment')
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
