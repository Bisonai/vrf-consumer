# VRF Consumer

Consumer smart contract that utilizes VRF functionality from [Orakl Network](https://github.com/bisonai-cic/orakl).

> Warning: This repository and smart contract are meant to be for deployment on [`baobab`](https://docs.klaytn.foundation/misc/faq#what-is-cypress-what-is-baobab).

Internally, the scripts access following smart contracts:

* `Prepayment` ([0xE22e67F7ce4b6FA9E3ABCB6125Fb53Cb577B34Ef](https://baobab.scope.klaytn.com/account/0xE22e67F7ce4b6FA9E3ABCB6125Fb53Cb577B34Ef))
* `VRFCoordinator` ([0x7cb70669dB89f6d20C47ecF8f010F477722D1E22](https://baobab.scope.klaytn.com/account/0x7cb70669dB89f6d20C47ecF8f010F477722D1E22))

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

After mnemonic is generated, you need to convert it to public address and fund it with KLAY.
If you do not have any KLAY in your account, you cannot deploy smart contracts or make any transactions.

You can convert your newly generated mnemonic with following hardhat task.
Please replace the `[MENONIC]` with your mnemonic.

```shell
npx hardhat --mnemonic [MNEMONIC]
```

The script will print out a public address corresponding to your mnemonic.
Then, you can use this address to receive free KLAY using [baobab's faucet](https://baobab.wallet.klaytn.foundation/faucet).

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

## Create and fund account

There are two types of payments supported by Orakle Network VRF: **Prepayment** and **Direct Payment**.

**Prepayment** requires user to create account and fund it with KLAY before being able to use it.
The script below will create a new account and deposit 1 KLAY from address corresponding to your mnemonic from `.env` file.

If you prefer to use Orakl Network VRF without having a long-lasting account, you can use **Direct Payment** method.
In such case, you can skip the following command and go directly to **Request VRF with Direct Payment**.

```
npx hardhat run scripts/create-and-fund.ts --network baobab
```

After successfully executing the command above, set the value of environment variable `ACC_ID` inside of `.env` file to account ID that was generated using the script above.
If you do not do it, the request for VRF using Prepayment won't be working properly.
After setting the `ACC_ID` in `.env` file, you can move to the next step **Request VRF with Prepayment**.

## Request & Read VRF

Before running following scripts, one must deploy `VRFConsumer` smart contract.
To deploy `VRFConsumer`, run `npx hardhat deploy --network baobab`.

### Request VRF with Prepayment

```
npx hardhat run scripts/request-vrf.ts --network baobab
```

### Request VRF with Direct Payment

```
npx hardhat run scripts/request-vrf-direct.ts --network baobab
```

### Read VRF response

```
npx hardhat run scripts/read-vrf.ts --network baobab
```
