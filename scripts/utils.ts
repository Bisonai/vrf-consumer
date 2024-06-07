export function getKeyHash() {
  const networkName = hre.network.name
  if (networkName == 'baobab') {
    return '0xd9af33106d664a53cb9946df5cd81a30695f5b72224ee64e798b278af812779c'
  } else if (networkName == 'cypress') {
    return '0x6cff5233743b3c0321a19ae11ab38ae0ddc7ddfe1e91b162fa8bb657488fb157'
  } else if (networkName == 'localhost') {
    return '0xeaec8ebbc75ec18c1d761e4e11d2eab84392a55786264a3aa7385ab4532db1e4'
  } else {
    throw new Error(`Key Hash is not defined for network: ${networkName}`)
  }
}
