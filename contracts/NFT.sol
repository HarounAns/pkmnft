// contracts/NFT.sol
// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address contractAddress;
    struct Pokemon {
        uint256 tokenId;
        string name;
        uint256[6] ivs; // HP, ATK, DEF, SpA, SpD, SPEED
    }
    mapping(uint256 => Pokemon) private _pokemonMap;

    string[] private pokemonList = [
        // currently only egg pokemon from Gen1
        "Bulbasaur",
        "Charmander",
        "Squirtle",
        "Caterpie",
        "Weedle",
        "Pidgey",
        "Rattata",
        "Spearow",
        "Ekans",
        "Sandshrew",
        "NidoranF",
        "NidoranM",
        "Vulpix",
        "Zubat",
        "Oddish",
        "Paras",
        "Venonat",
        "Diglett",
        "Meowth",
        "Psyduck",
        "Mankey",
        "Growlithe",
        "Poliwag",
        "Abra",
        "Machop",
        "Bellsprout",
        "Tentacool",
        "Geodude",
        "Ponyta",
        "Slowpoke",
        "Magnemite",
        "Doduo",
        "Seel",
        "Grimer",
        "Shellder",
        "Gastly",
        "Onix",
        "Drowzee",
        "Krabby",
        "Voltorb",
        "Exeggcute",
        "Cubone",
        "Lickitung",
        "Koffing",
        "Rhyhorn",
        "Tangela",
        "Kangaskhan",
        "Horsea",
        "Goldeen",
        "Staryu",
        "Scyther",
        "Pinsir",
        "Magikarp",
        "Lapras",
        "Eevee",
        "Porygon",
        "Omanyte",
        "Kabuto",
        "Aerodactyl",
        "Dratini"
    ];

    constructor(address marketplaceAddress) ERC721("Pokemon Tokens", "PKMN") {
        contractAddress = marketplaceAddress;
    }

    // this is hacky and leaves us susceptible to an attack: https://medium.com/@tiagobertolo/how-to-safely-generate-random-numbers-in-solidity-contracts-bd8bd217ff7b
    function randModulus(uint256 mod) internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        msg.sender
                    )
                )
            ) % mod;
    }

    // adds a nonce to help randomize, I need this since using randModulus multiple times results in same rand value 
    function randModulus(uint256 mod, uint256 nonce)
        internal
        view
        returns (uint256)
    {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty + nonce,
                        msg.sender
                    )
                )
            ) % mod;
    }

    function _setPokemonMapping(
        uint256 tokenId,
        string memory _pokemonName,
        uint256[6] memory _ivs
    ) internal virtual {
        require(_exists(tokenId), "Setting Pokemon with nonexistent token");
        _pokemonMap[tokenId] = Pokemon(tokenId, _pokemonName, _ivs);
    }

    function pokemon(uint256 tokenId)
        public
        view
        virtual
        returns (Pokemon memory)
    {
        return _pokemonMap[tokenId];
    }

    function createToken() public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);

        // randomly generate pokemon and ivs
        string memory _pokemonName = pokemonList[
            randModulus(pokemonList.length)
        ];

        uint256[6] memory _ivs;
        for (uint256 i = 0; i < 6; i++) {
            uint256 randIV = randModulus(32, i);
            _ivs[i] = randIV;
        }
        _setPokemonMapping(newItemId, _pokemonName, _ivs);
        setApprovalForAll(contractAddress, true);
        return newItemId;
    }

    function fetchMyItems() public view returns (Pokemon[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (ownerOf(i + 1) == msg.sender) {
                itemCount += 1;
            }
        }

        Pokemon[] memory items = new Pokemon[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (ownerOf(i + 1) == msg.sender) {
                uint256 currentId = i + 1;
                Pokemon storage currentItem = _pokemonMap[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
