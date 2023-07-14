import { ethers, getNamedAccounts } from 'hardhat'
import { getKeyHash } from './utils'
import { estimateServiceFee } from './get-estimated-service-fee'

async function main() {
  const vrfConsumer = await ethers.getContract('VRFConsumer')

  const keyHash = getKeyHash()
  const callbackGasLimit = 500_000
  const numWords = 1

  const { deployer } = await getNamedAccounts()
  const estimatedServiceFee = await estimateServiceFee()

  const txReceipt = await (
    await vrfConsumer.requestRandomWordsDirect(keyHash, callbackGasLimit, numWords, deployer, {
      value: ethers.utils.parseEther(estimatedServiceFee.toString())
    })
  ).wait()

  console.log(txReceipt)
  console.log('Requested random words using direct payment')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
