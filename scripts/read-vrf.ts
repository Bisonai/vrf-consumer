import { ethers } from 'hardhat'

async function main() {
  const userContract = await ethers.getContract('VRFConsumer')
  console.log('VRFConsumer', userContract.address)

  const randomWord = await userContract.sRandomWord()
  console.log(`randomWord ${randomWord.toString()}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
