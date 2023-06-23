import { HardhatRuntimeEnvironment } from 'hardhat/types'
import { DeployFunction } from 'hardhat-deploy/types'

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre
  const { deploy } = deployments
  const { deployer, vrfCoordinator: coordinatorAddress } = await getNamedAccounts()

  console.log('0-VRFConsumer.ts')

  await deploy('VRFConsumer', {
    args: [coordinatorAddress],
    from: deployer,
    log: true
  })
}

export default func
func.id = 'deploy-vrf-consumer'
func.tags = ['vrf-consumer']
