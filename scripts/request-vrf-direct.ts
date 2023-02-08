import { ethers } from 'hardhat'

async function main() {
  const vrfConsumer = await ethers.getContract('VRFConsumer')

  const keyHash = '0x47ede773ef09e40658e643fe79f8d1a27c0aa6eb7251749b268f829ea49f2024'
  const callbackGasLimit = 500_000
  const numWords = 1

  const txReceipt = await (
    await vrfConsumer.requestRandomWordsDirect(keyHash, callbackGasLimit, numWords, {
      value: ethers.utils.parseEther('1.0')
    })
  ).wait()

  console.log(txReceipt)
  console.log('Requested random words using direct payment')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
