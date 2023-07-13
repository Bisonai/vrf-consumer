import { ethers, getNamedAccounts } from 'hardhat'
import { getKeyHash } from './utils'

async function main() {
  const vrfConsumer = await ethers.getContract('VRFConsumer')

  const keyHash = getKeyHash()
  const callbackGasLimit = 500_000
  const numWords = 1

  const { deployer } = await getNamedAccounts()
  const txReceipt = await (
    await vrfConsumer.requestRandomWordsDirect(keyHash, callbackGasLimit, numWords, deployer, {
      value: ethers.utils.parseEther('2.5')
    })
  ).wait()

  console.log(txReceipt)
  console.log('Requested random words using direct payment')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
