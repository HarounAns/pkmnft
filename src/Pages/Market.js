import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import {
    nftmarketaddress,
    nftaddress
} from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/Market.sol/NFTMarket.json'
import { Container, Spinner } from 'reactstrap'
import PokemonCard from '../Components/PokemonCard'


export default function Market({ addr }) {
    const [loading, setLoading] = useState(true)
    const [marketItems, setMarketItems] = useState(null)

    const loadPage = async () => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
        const nftMarketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)

        await fetchMarketItems(nftContract, nftMarketContract)
    }

    const fetchMarketItems = async (nftContract, nftMarketContract) => {
        setLoading(true)
        const formattedMarketItems = await getFormattedMarketItems(nftMarketContract, nftContract, nftaddress);
        setMarketItems(formattedMarketItems.reverse())
        setLoading(false)
    }

    /* test/sample-test.js */
    const getFormattedMarketItems = async (market, nft, nftContractAddress) => {
        /* query for and return the unsold items */
        const items = await market.fetchMarketItems(nftContractAddress)
        const formattedMarketItems = await Promise.all(items.map(async i => {
            const { tokenId, seller, owner, forSale, price, itemId: marketItemId } = i;
            const pokemon = await nft.pokemon(tokenId);
            const { name, ivs } = pokemon;

            return {
                price: price.toString(),
                seller,
                owner,
                forSale,
                marketItemId,
                pokemon: {
                    name,
                    ivs: ivs.map(iv => parseInt(iv)),
                    tokenId: tokenId.toString(),
                }
            }
        }))
        return formattedMarketItems;
    }

    useEffect(() => {
        loadPage()
    }, [addr])

    if (loading) return <Spinner />

    if (!marketItems.length) {
        return <h1>No Items on Market Yet</h1>
    }
    return (
        <Container>
            {marketItems.map((item, i) => {
                const { pokemon, price, seller, marketItemId } = item
                return (
                    <Container key={i} style={{ marginTop: "50px", marginBottom: "20px" }}>
                        <PokemonCard
                            pokemon={pokemon}
                            price={price}
                            seller={seller}
                            addr={addr}
                            marketItemId={marketItemId}
                            reloadPage={loadPage}
                        />
                    </Container>
                )
            }
            )}
        </Container>
    )
}
