# VRF Consumer

Consumer smart contract that utilizes VRF functionality from [Orakl Network](https://github.com/bisonai-cic/ICN).

Warning: This repository and smart contract is meant to be for deployment on `baobab`.

Internally, the scripts access following smart contracts:

* Prepayment ([`0x6f735909cd47b9f9E9B80056fFCC9b667f62411e`](https://baobab.scope.klaytn.com/account/0x6f735909cd47b9f9E9B80056fFCC9b667f62411e))
* VRFCoordinator ([`0xC2690d24a850116180300940Ad248f3Fc1a0e83E`](https://baobab.scope.klaytn.com/account/0xC2690d24a850116180300940Ad248f3Fc1a0e83E))

## Installation

```shell
yarn install
```

## Compilation

```shell
yarn compile
```

## Deploy

```shell
npx hardhat node --network baobab
```

## Request & Read VRF

Before running following scripts, one must deploy `VRFConsumer` smart contract.
To deploy `VRFConsumer`, run `npx hardhat deploy --network baobab`.

### Request VRF

```
npx hardhat run scripts/request-vrf.ts --network baobab
```

### Request VRF with direct payment

```
npx hardhat run scripts/request-vrf-direct.ts --network baobab
```

### Read VRF response

```
npx hardhat run scripts/read-vrf.ts --network baobab
```
