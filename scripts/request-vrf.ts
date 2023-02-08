import { ethers } from 'hardhat'

async function main() {
  const vrfConsumer = await ethers.getContract('VRFConsumer')

  const keyHash = '0x47ede773ef09e40658e643fe79f8d1a27c0aa6eb7251749b268f829ea49f2024'
  const accId = 1
  const callbackGasLimit = 500_000
  const numWords = 1

  await vrfConsumer.requestRandomWords(keyHash, accId, callbackGasLimit, numWords)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
