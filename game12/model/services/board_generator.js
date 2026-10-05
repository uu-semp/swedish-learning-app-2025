export function GenerateBoard(streets, ranges, difficulty) {
    if (difficulty === 1) {
        return GenerateT(streets)
    }
    else {
        return GenerateHorizontal(streets, ranges, difficulty)
    }
}

function GenerateHorizontal(streets, ranges) {
    let building_positions_horizontal = [
        { col: 1, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 2, row: 3 },
        { col: 3, row: 1 },
        { col: 3, row: 3 },
        { col: 4, row: 1 },
        { col: 4, row: 3 },
        { col: 5, row: 1 },
        { col: 5, row: 3 },
    ]

    let chosen_street_1 = streets[Math.floor((Math.random() * streets.length))]

    let buildings_horizontal = []
    for (let index = 0; index < building_positions_horizontal.length; index++) {
        let house_number = chosen_range + index
        buildings_horizontal[index] = {
            Type: "HOUSE",
            Street: chosen_street_1,
            HouseNumber: house_number,
            col: building_positions_horizontal[index].col,
            row: building_positions_horizontal[index].row
        }
    }

    return {
        BuildingsHorizontal: buildings_horizontal,
        ChosenRange: chosen_range
    }
}

function randomStartPair(maxOffset) {
    const maxStartPair = 48 - maxOffset;
    return Math.floor(Math.random() * (maxStartPair + 1));
}

function getHouseNumber(startPair, offset, useOddNumbers) {
    const oddNumber = 2 * (startPair + offset) + 1;
    if (useOddNumbers) {
        return oddNumber;
    }
    return oddNumber + 1;
}

function GenerateT(streets) {
    let building_positions_horizontal = [
    { col: 1, row: 1, offset: 0, side: "top" },
    { col: 2, row: 1, offset: 1, side: "top" },
    { col: 3, row: 1, offset: 2, side: "top" },
    { col: 4, row: 1, offset: 3, side: "top" },
    { col: 5, row: 1, offset: 4, side: "top" },
    { col: 6, row: 1, offset: 5, side: "top" },
    { col: 7, row: 1, offset: 6, side: "top" },

    { col: 1, row: 3, offset: 0, side: "bottom" },
    { col: 2, row: 3, offset: 1, side: "bottom" },
    { col: 6, row: 3, offset: 5, side: "bottom" },
    { col: 7, row: 3, offset: 6, side: "bottom" }
    ];

    let building_positions_vertical = [
        { col: 3, row: 4, offset: 0, side: "left" },
        { col: 3, row: 5, offset: 1, side: "left" },
        { col: 3, row: 6, offset: 2, side: "left" },

        { col: 5, row: 4, offset: 0, side: "right" },
        { col: 5, row: 5, offset: 1, side: "right" },
        { col: 5, row: 6, offset: 2, side: "right" }
    ];

    let chosen_street_1 = streets[Math.floor((Math.random() * streets.length))]
    streets = streets.filter(street => street !== chosen_street_1)
    let chosen_street_2 = streets[Math.floor((Math.random() * streets.length))]

    const horizontalStartPair = randomStartPair(6)
    const verticalStartPair = randomStartPair(2)

    const topIsOdd = Math.random() < 0.5
    const leftIsOdd = Math.random() < 0.5


    let buildings_horizontal = []
    for (let index = 0; index < building_positions_horizontal.length; index++) {
        const position = building_positions_horizontal[index]
        const useOddNumbers =
            position.side === "top"
                ? topIsOdd
                : !topIsOdd
        const house_number = getHouseNumber(
            horizontalStartPair,
            position.offset,
            useOddNumbers
        )
        buildings_horizontal[index] = {
            type: "HOUSE",
            id: chosen_street_1 + "_" + house_number,
            street: chosen_street_1,
            houseNumber: house_number,
            col: position.col,
            row: position.row
        }
    }

    let buildings_vertical = []

    for (let index = 0; index < building_positions_vertical.length; index++) {
        const position = building_positions_vertical[index]
        const useOddNumbers =
            position.side === "left"
                ? leftIsOdd
                : !leftIsOdd
        const house_number = getHouseNumber(
            verticalStartPair,
            position.offset,
            useOddNumbers
        )

        buildings_vertical[index] = {
            type: "HOUSE",
            id: chosen_street_2 + "_" + house_number,
            street: chosen_street_2,
            houseNumber: house_number,
            col: position.col,
            row: position.row
        }
    }

    return {
        BuildingsHorizontal: buildings_horizontal,
        BuildingsVertical: buildings_vertical,
        HorizontalStreet: chosen_street_1,
        VerticalStreet: chosen_street_2
    }
}

/*
function GenerateRoad(road_type, question, street) {
    const correct_answer_building_id = null;

    // Create a range for the house numbers.
    const range_offset = Math.floor(Math.random * 8);
    const range_start = null;

    // If the house number is specified, base the range on that. Otherwise, create a random range
    if (house_number) {
        range_start = Math.max(house_number - range_offset, 1);
        range_start = Math.min(range_start, 91);
    } else {
        range_start = 1 + Math.floor(Math.min(Math.random() * 90));
    }

    // Have it start at odd numbers
    if (range_start % 2 === 0) {
        range_start += 1;
    }

    const range = [range_start, range_start + 8];

    const correct_house = question.number;

    // if question specifies no correct house, select a random one
    if (!correct_house) {
        correct_house = 1 + Math.floor(Math.random() * 8);
    }

    // begin by just filling the array with normal houses
    const buildings = [];
    for (let index = 0; index < 8; index++) {
        // if diff one, the correct house is just the number and street we're searching for
        const house_number = index + range[0];
        const id = street + "_" + house_number;
        buildings[i] = [id, Building.HOUSE];
    }

    // custom logic for each question type
    if (question.direction) {
        if (question.direction === "OPPOSITE") {
            // stuff
        }
    }

    return {
        chosen_range: ,
        chosen_building: ,
        chosen_vehice: ,
        street: street,
        buildings: buildings,
        correct_answer_building_id: correct_answer_building_id,
    };
}


*/