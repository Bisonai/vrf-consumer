import { ethers } from 'hardhat'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const ACC_ID = process.env.ACC_ID
  if (!ACC_ID) {
    console.error('ACC_ID not defined in .env file')
  } else {
    const vrfConsumer = await ethers.getContract('VRFConsumer')

    const keyHash = '0x47ede773ef09e40658e643fe79f8d1a27c0aa6eb7251749b268f829ea49f2024'
    const callbackGasLimit = 500_000
    const numWords = 1

    await vrfConsumer.requestRandomWords(keyHash, ACC_ID, callbackGasLimit, numWords)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
