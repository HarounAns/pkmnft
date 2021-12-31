// HP, ATK, DEF, SpA, SpD, SPEED
const convertIVArrayToObj = ivs => {
    const [hp, atk, def, spA, spD, speed] = ivs;
    return {
        hp,
        atk,
        def,
        spA,
        spD,
        speed
    };
}

const utils = {
    convertIVArrayToObj,
}

module.exports = utils;