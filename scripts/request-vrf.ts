import { ethers } from 'hardhat'
import dotenv from 'dotenv'

dotenv.config()

async function main() {
  const ACC_ID = process.env.ACC_ID
  if (!ACC_ID) {
    console.error('ACC_ID not defined in .env file')
  } else {
    const vrfConsumer = await ethers.getContract('VRFConsumer')

    const keyHash = '0xd9af33106d664a53cb9946df5cd81a30695f5b72224ee64e798b278af812779c'
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
