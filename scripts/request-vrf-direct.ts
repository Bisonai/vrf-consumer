import { ethers } from 'hardhat'

async function main() {
  const vrfConsumer = await ethers.getContract('VRFConsumer')

  const keyHash = '0xd9af33106d664a53cb9946df5cd81a30695f5b72224ee64e798b278af812779c'
  const callbackGasLimit = 500_000
  const numWords = 1

  const txReceipt = await (
    await vrfConsumer.requestRandomWordsDirect(keyHash, callbackGasLimit, numWords, {
      value: ethers.utils.parseEther('3.0')
    })
  ).wait()

  console.log(txReceipt)
  console.log('Requested random words using direct payment')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
