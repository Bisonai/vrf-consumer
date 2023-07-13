import { ethers } from 'hardhat'
import { CoordinatorBase__factory } from '@bisonai/orakl-contracts'
import dotenv from 'dotenv'

dotenv.config()

export async function estimateServiceFee() {
  const { vrfCoordinator: coordinatorAddress } = await hre.getNamedAccounts()
  const coordinator = await ethers.getContractAt(CoordinatorBase__factory.abi, coordinatorAddress)

  const reqCount = 1
  const numSubmission = 1
  const callbackGasLimit = 500_000
  const estimatedServiceFee = await coordinator.estimateFee(
    reqCount,
    numSubmission,
    callbackGasLimit
  )
  const amountKlay = ethers.utils.formatUnits(estimatedServiceFee, 'ether')

  console.log(`Estimated Price for 1 Request is: ${amountKlay} Klay`)
  return amountKlay
}
async function main() {
  await estimateServiceFee()
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
