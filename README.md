# VRF Consumer

Consumer smart contract that utilizes VRF functionality from [Orakl Network](https://github.com/bisonai-cic/orakl).

> Warning: This repository and smart contract are meant to be for deployment on [`baobab`](https://docs.klaytn.foundation/misc/faq#what-is-cypress-what-is-baobab).

Internally, the scripts access following smart contracts:

* `Prepayment` ([0x6f735909cd47b9f9E9B80056fFCC9b667f62411e](https://baobab.scope.klaytn.com/account/0x6f735909cd47b9f9E9B80056fFCC9b667f62411e))
* `VRFCoordinator` ([0xC2690d24a850116180300940Ad248f3Fc1a0e83E](https://baobab.scope.klaytn.com/account/0xC2690d24a850116180300940Ad248f3Fc1a0e83E))

If you want to access different deployments of `Prepayment` or `VRFCoordinator`, you can change it inside `hardhat.config.ts` in `namedAccounts` property.

## Prerequisites

Create a copy of `.env.example` file and fill in values for `MNEMONIC` and `PROVIDER` environment variables.
These variables will be used for connection to JSON-RPC endpoint, deployment and use of your [`VRFConsumer` smart contract](contracts/VRFConsumer.sol).

```shell
cp .env.example .env
```

`PROVIDER` can be set to any JSON-RPC endpoint.
The list of free available JSON-RPC endpoint can be found in [official Klaytn documentation](https://docs.klaytn.foundation/content/dapp/json-rpc/public-en#testnet-baobab-public-json-rpc-endpoints).

`MNEMONIC` can be generated using [npm mnemonics package](https://www.npmjs.com/package/mnemonics).

```shell
npx mnemonics
```

After mnemonic is generated, we need to convert it to public address and fund it with KLAY.
If you do not have any KLAY in your account, you cannot deploy smart contracts or make any transactions.

You can convert your newly generated mnemonic with following hardhat task.
Please replace the `[MENONIC]` with your mnemonic.

```shell
npx hardhat --mnemonic [MNEMONIC]
```

The script will print out a public address corresponding to your mnemonic.
Then, you can use this address to receive free KLAY from [baobab's faucet](https://baobab.wallet.klaytn.foundation/faucet).

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
npx hardhat deploy --network baobab
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
