import React from 'react'
import { Button, Card, Col, Container, Row } from 'reactstrap'
import { convertIVArrayToObj } from '../utils'
import { nftmarketaddress, nftaddress } from '../config';
import NFTMarket from '../artifacts/contracts/Market.sol/NFTMarket.json'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'


export default function PokemonCard({
    pokemon,
    sellable,
    listingPrice,
    reloadPage,
    seller,
    price,
    marketItemId,
    addr
}) {
    const { name, ivs, tokenId } = pokemon
    const ivsObj = convertIVArrayToObj(ivs)

    // TODO: build better listing experience
    const handleClick = async () => {
        const _price = window.prompt(`How much (in ETH) would you like to list your ${name} for? Please note that there is a listing fee of ${ethers.utils.formatEther(listingPrice)}.`)
        if (!_price) return;

        if (isNaN(_price)) {
            alert('Error: Must input number for listed price');
            return;
        }

        const confirmed = window.confirm(`Are you sure you want to list your ${name} for ${_price} ETH?`)
        if (!confirmed) return;

        console.log(`Listed ${name} for ${price} ETH`);

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const nftMarketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)

        await listPokemon(nftMarketContract, price);
        reloadPage()
    }

    const listPokemon = async (nftMarketContract, price) => {
        const auctionPrice = ethers.utils.parseUnits(price.toString(), 'ether')
        console.log({ nftaddress, tokenId, auctionPrice, listingPrice: listingPrice.toString() })
        const transaction = await nftMarketContract.listItemForSale(nftaddress, tokenId, auctionPrice, { value: listingPrice.toString() })
        await transaction.wait()
    }

    const handleUnlist = async () => {
        const confirmed = window.confirm(`Are you sure you want to unlist your ${pokemon.name}? You will not be refunded the listing price.`)
        if (!confirmed) return;

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const nftMarketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
        await unlistPokemon(nftMarketContract)
        reloadPage()
    }

    const unlistPokemon = async (nftMarketContract) => {
        const transaction = await nftMarketContract.unlistForSaleItem(nftaddress, tokenId)
        await transaction.wait()
    }

    const handleBuy = async () => {
        const confirmed = window.confirm(`Are you sure you want to buy ${pokemon.name} for ${ethers.utils.formatEther(price)} ETH? This is a non-refundable action.`)
        if (!confirmed) return;

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const nftMarketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
        await buyPokemon(nftMarketContract)
        reloadPage()
    }

    const buyPokemon = async (nftMarketContract) => {
        const auctionPrice = ethers.utils.parseUnits(ethers.utils.formatEther(price), 'ether')
        const transaction = await nftMarketContract.buyItem(nftaddress, marketItemId, { value: auctionPrice })
        await transaction.wait()
    }

    return (
        <Container style={{ marginTop: "50px", display: 'flex', justifyContent: 'center' }}>
            <Card style={{ width: "500px" }}>
                <Container>
                    <Row>
                        <Container>
                            <img
                                style={{ transform: "scale(2)", marginTop: "60px" }}
                                src={`https://play.pokemonshowdown.com/sprites/ani/${name.toLowerCase()}.gif`}
                                alt={name} />
                        </Container>
                    </Row>
                    <Row style={{ marginTop: "30px" }}>
                        <Col>
                            {name}
                        </Col>
                    </Row>
                    <Container style={{ marginTop: "30px", width: "200px" }}>
                        <Row>
                            <Col>Atk: {ivsObj.atk}</Col>
                            <Col>Def: {ivsObj.def}</Col>
                        </Row>
                        <Row>
                            <Col>SpA: {ivsObj.spA}</Col>
                            <Col>SpD: {ivsObj.spD}</Col>
                        </Row>
                        <Row>
                            <Col>HP: {ivsObj.hp}</Col>
                            <Col>Speed: {ivsObj.speed}</Col>
                        </Row>
                    </Container>
                    {
                        sellable && (
                            <Row>
                                <Col>
                                    <Button
                                        disabled={!listingPrice}
                                        onClick={handleClick} style={{ margin: "20px", width: "200px" }}>List</Button>
                                </Col>
                            </Row>
                        )
                    }
                    {
                        seller && (
                            <Container style={{ textAlign: 'left' }}>
                                <Row>
                                    <Container style={{ marginTop: "10px" }}>
                                        Seller: {seller}
                                    </Container>
                                </Row>

                                <Row>
                                    <Container style={{ marginTop: "10px" }}>
                                        Price: {ethers.utils.formatEther(price)} ETH
                                    </Container>
                                </Row>
                            </Container>
                        )
                    }
                    {
                        seller && seller.toLowerCase() !== addr.toLowerCase() && (
                            <Row>
                                <Col>
                                    <Button
                                        color="primary"
                                        onClick={handleBuy} style={{ margin: "20px", width: "200px" }}>Buy</Button>
                                </Col>
                            </Row>
                        )
                    }
                    {
                        seller && seller.toLowerCase() == addr.toLowerCase() && (
                            <Row>
                                <Col>
                                    <Button
                                        onClick={handleUnlist} style={{ margin: "20px", width: "200px" }}>Unlist</Button>
                                </Col>
                            </Row>
                        )
                    }
                </Container>
            </Card>
        </Container>
    )
}
