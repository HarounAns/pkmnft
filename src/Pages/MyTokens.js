import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import {
    nftaddress,
    nftmarketaddress
} from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/Market.sol/NFTMarket.json'
import { Container, Spinner } from 'reactstrap'
import PokemonCard from '../Components/PokemonCard'

export default function MyTokens({ addr }) {
    const [loading, setLoading] = useState(true)
    const [listingPrice, setListingPrice] = useState(null)
    const [pokemonList, setPokemonList] = useState([])

    const loadPage = async () => {
        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)
        const nftMarketContract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)

        fetchMyTokens(nftContract)
        getListingPrice(nftMarketContract)
    }

    const fetchMyTokens = async (nftContract) => {
        setLoading(true)
        const res = await nftContract.fetchMyItems()

        const list = []
        for (const pokemon of res) {
            const { name, ivs, tokenId } = pokemon
            list.push({ name, tokenId, ivs: ivs.map(iv => parseInt(iv)) })
        }

        setPokemonList(list.reverse())
        setLoading(false)
    }

    const getListingPrice = async (nftMarketContract) => {
        const res = await nftMarketContract.getListingPrice()
        setListingPrice(res)
    }

    useEffect(() => {
        loadPage()
    }, [addr])

    if (loading) {
        return <Spinner />
    }

    if (!pokemonList.length) {
        return <h1>No Pokemon yet!</h1>
    }

    return (
        <Container style={{ marginBottom: "20px" }}>
            {pokemonList.map((pokemon, i) => (
                <Container key={i} style={{ marginTop: "50px" }}>
                    <PokemonCard 
                        pokemon={pokemon} 
                        sellable 
                        listingPrice={listingPrice} 
                        reloadPage={loadPage}
                        addr={addr}
                    />
                </Container>
            ))}
        </Container >
    )
}
