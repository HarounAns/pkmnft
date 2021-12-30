/* test/sample-test.js */
const getFormattedMarketItems = async (market, nft, nftContractAddress) => {
  /* query for and return the unsold items */
  const items = await market.fetchMarketItems(nftContractAddress)
  const formattedMarketItems = await Promise.all(items.map(async i => {
    const { tokenId, seller, owner, forSale, price } = i;
    const pokemon = await nft.pokemon(tokenId);
    const { name, ivs } = pokemon;

    return {
      price: price.toString(),
      tokenId: tokenId.toString(),
      seller,
      owner,
      forSale,
      name,
      ivs: ivs.map(iv => parseInt(iv)),
    }
  }))
  return formattedMarketItems;
}

// TODO: make these assert something and have actual tests
describe("NFTMarket", function () {
  it("Should create and execute market sales", async function () {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("NFTMarket")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("NFT")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('1', 'ether')
    const [_, buyerAddress] = await ethers.getSigners()

    /* create two tokens */
    await nft.createToken()
    await nft.createToken()

    const myNFTs = await nft.fetchMyItems()
    console.log('myNFTs', myNFTs);

    /* put both tokens for sale */
    await market.listItemForSale(nftContractAddress, 1, auctionPrice, { value: listingPrice })
    await market.listItemForSale(nftContractAddress, 2, auctionPrice, { value: listingPrice })

    /* execute sale of token to another user */
    await market.connect(buyerAddress).buyItem(nftContractAddress, 1, { value: auctionPrice })

    const buyerNFTs = await nft.connect(buyerAddress).fetchMyItems();
    console.log('buyerNFTs', buyerNFTs);

    let formattedMarketItems = await getFormattedMarketItems(market, nft, nftContractAddress)
    console.log('items: ', formattedMarketItems)
    
    // unlist other item that wasnt sold
    await market.unlistForSaleItem(nftContractAddress, 2)

    formattedMarketItems = await getFormattedMarketItems(market, nft, nftContractAddress)
    console.log('items after unlisting: ', formattedMarketItems)
  })
})