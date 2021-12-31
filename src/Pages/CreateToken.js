import { useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import {
    nftaddress
} from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import { Button, Container } from 'reactstrap'
import { Spinner } from 'reactstrap';
import PokemonCard from '../Components/PokemonCard'


export default function CreateToken() {
    const [loading, setLoading] = useState(false)
    const [pokemon, setPokemon] = useState(null)

    const mintPokemon = async () => {
        // disable create so you dont duplicate NFTs
        if (loading) return

        setLoading(true)

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()
        const nftContract = new ethers.Contract(nftaddress, NFT.abi, signer)

        const tokenId = await createToken(nftContract);
        console.log(tokenId);
        const pokemonToken = await fetchPokemon(nftContract, tokenId);

        setPokemon(pokemonToken)
        setLoading(false)
    }

    const createToken = async (nftContract) => {
        const transaction = await nftContract.createToken()
        const tx = await transaction.wait()
        const event = tx.events[0]
        const value = event.args[2]
        const tokenId = value.toNumber()
        return tokenId
    }

    const fetchPokemon = async (nftContract, tokenId) => {
        const pokemon = await nftContract.pokemon(tokenId)
        const { name, ivs } = pokemon;

        return { name, ivs: ivs.map(iv => parseInt(iv)) }
    }

    return (
        <Container>
            <Button
                disabled={loading}
                style={{ width: "100%", ...style }}
                onClick={mintPokemon}>
                {!loading
                    ?
                    "Mint Pokemon"
                    :
                    <Spinner color="light" />
                }
            </Button>
            {pokemon && (
                <Container style={{ marginTop: "50px", display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <PokemonCard pokemon={pokemon} />
                </Container>
            )}
        </Container>
    )
}

const style = {
    marginTop: "20px"
}

const imageStyle = {
    width: "350px",
    borderRadius: "5px",
    marginTop: "30px"
}