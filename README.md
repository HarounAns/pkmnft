
# Pokemon NFT
Smart Contract and Web App for Pokemon NFTs and Market Place. Uses Hardhat for Smart Contract development and deployments. Uses React for frontend application. Will be built on Polygon.

## Access Patterns and Operations
```shell
fetchMyItems: Access all Pokemon NFTs I own
fetchMarketItems: Access Market Place items that are for Sale
createToken: Mint a new random Pokemon NFT
listItemForSale: Put Pokemon NFT on the market (costs listing fee - how we make money)
unlistItemForSale: take Pokemon off the Market (listing fee is not refunded)
buyItem: buy Pokemon NFT from Market
```

## Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
