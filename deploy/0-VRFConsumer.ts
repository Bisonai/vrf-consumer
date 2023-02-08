import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'
import { Prepayment__factory } from '@bisonai-cic/icn-contracts'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, network } = hre
  const { deploy } = deployments
  const {
    deployer,
    vrfCoordinator: vrfCoordinatorAddress,
    prepayment: prepaymentAddress
  } = await getNamedAccounts()

  console.log('0-VRFConsumer.ts')

  if (network.name != 'baobab') {
    console.log('Skipping')
    return
  }

  const vrfConsumerDeployment = await deploy('VRFConsumer', {
    args: [vrfCoordinatorAddress],
    from: deployer,
    log: true
  })

  const prepaymentConsumerSigner = await ethers.getContractAt(
    Prepayment__factory.abi,
    prepaymentAddress,
    deployer
  )

  // Create account
  const accountReceipt = await (await prepaymentConsumerSigner.createAccount()).wait()
  const { accId } = accountReceipt.events[0].args

  // Deposit 1 KLAY
  await (
    await prepaymentConsumerSigner.deposit(accId, {
      value: ethers.utils.parseUnits('1', 'ether')
    })
  ).wait()

  // Add consumer to account
  await (await prepaymentConsumerSigner.addConsumer(accId, vrfConsumerDeployment.address)).wait()
}

export default func
func.id = 'deploy-vrf-consumer'
func.tags = ['vrf-consumer']
