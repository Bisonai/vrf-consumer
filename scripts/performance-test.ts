import { ethers } from 'hardhat'
import Bottleneck from 'bottleneck'
import { NonceManager } from '@ethersproject/experimental'

const WAIT_TIME_MS = 125
const TOTAL_NUM_CALLS = 300
const RATE_LIMIT_PER_SECOND = 200

async function main() {
  const vrfConsumer = await ethers.getContract('VRFConsumer')

  const keyHash = '0x47ede773ef09e40658e643fe79f8d1a27c0aa6eb7251749b268f829ea49f2024'
  const callbackGasLimit = 500_000
  const numWords = 1
  const value = ethers.utils.parseEther('1.0')

  const providerUrl = 'https://public-en.kairos.node.kaia.io'
  const provider = new ethers.providers.JsonRpcProvider(providerUrl)

  const signer = new ethers.Wallet(
    '0d3046f718bad9413a30559bcb36e10c2c257ce83f760cb5f83bb676bb51a65b',
    provider
  )
  const signerWithProvider = signer.connect(provider)
  const nonceManager = new NonceManager(signerWithProvider)

  const vrfConsumerNonce = new ethers.Contract(
    vrfConsumer.address,
    vrfConsumer.interface,
    nonceManager
  )

  const limiter = new Bottleneck({
    maxConcurrent: RATE_LIMIT_PER_SECOND,
    minTime: 1000 / RATE_LIMIT_PER_SECOND
  })

  const txPromises = []

  for (let i = 1; i <= TOTAL_NUM_CALLS; i++) {
    console.log(`Call ${i}`)
    try {
      const txPromise = limiter.schedule(async () => {
        const tx = await vrfConsumerNonce.requestRandomWordsDirect(
          keyHash,
          callbackGasLimit,
          numWords,
          {
            value
          }
        )
        return tx.wait()
      })
      txPromises.push(txPromise)
    } catch (error) {
      console.error(`Error in loop ${i}:`, error)
    }

    if (i < TOTAL_NUM_CALLS) {
      await new Promise((resolve) => setTimeout(resolve, WAIT_TIME_MS))
    }
  }

  const txResults = await Promise.allSettled(txPromises)
  const successfulTxs = txResults
    .filter((result) => result.status === 'fulfilled')
    .map((result) => result.value)
  const tps = successfulTxs.length / ((TOTAL_NUM_CALLS * WAIT_TIME_MS) / 1000)

  console.log(`Total transactions: ${TOTAL_NUM_CALLS}`)
  console.log(`Successful transactions: ${successfulTxs.length}`)
  console.log(`TPS: ${tps}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
function delay(arg0: number) {
  throw new Error('Function not implemented.')
}
