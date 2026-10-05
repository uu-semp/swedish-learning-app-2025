export function GenerateBoard(streets, ranges, difficulty) {
    if (difficulty === 1) {
        return GenerateT(streets, ranges, difficulty)
    }
    else {
        return GenerateHorizontal(streets, ranges, difficulty)
    }
}

function GenerateHorizontal(streets, ranges) {
    let building_positions_horionztal = [
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

    let chosen_street_1 = streets[Math.floor((Math.random() * streets.length + 1))]

    let buildings_horionztal = []
    for (let index = 0; index < building_positions_horionztal; index++) {
        let house_number = chosen_range + index
        buildings_horionztal[index] = {
            Type: "HOUSE",
            Street: chosen_street_1,
            HouseNumber: house_number,
            col: building_positions_horionztal[index].col,
            row: building_positions_horionztal[index].row
        }
    }

    return {
        BuildingsHorizontal: buildings_horionztal,
        ChosenRange: chosen_range
    }

}

function GenerateT(streets, ranges) {
    let building_positions_horionztal = [
        { col: 1, row: 1 },
        { col: 1, row: 3 },
        { col: 2, row: 1 },
        { col: 2, row: 3 },
        { col: 4, row: 1 },
        { col: 4, row: 3 },
        { col: 5, row: 1 },
        { col: 5, row: 3 },
    ]

    let building_positions_vertical = [
        { col: 4, row: 4 },
        { col: 2, row: 4 },
        { col: 4, row: 5 },
        { col: 2, row: 5 },
    ]

    let chosen_street_1 = streets[Math.floor((Math.random() * streets.length + 1))]
    streets = streets.filter(street => street !== chosen_street_1)
    let chosen_street_2 = streets[Math.floor((Math.random() * streets.length + 1))]

    let chosen_range_index = Math.floor((Math.random() * ranges.length))
    console.log("index: " + chosen_range_index)
    let chosen_range = ranges[Math.floor((Math.random() * ranges.length))]

    console.log("ranges: " + ranges)
    console.log("Chosen range: " + chosen_range)

    let buildings_horionztal = []
    for (let index = 0; index < building_positions_horionztal.length; index++) {
        let house_number = chosen_range[0] + index
        buildings_horionztal[index] = {
            type: "HOUSE",
            id: chosen_street_1 + "_" + house_number,
            street: chosen_street_1,
            houseNumber: house_number,
            col: building_positions_horionztal[index].col,
            row: building_positions_horionztal[index].row
        }
    }

    let buildings_vertical = []
    for (let index = 0; index < building_positions_vertical.length; index++) {
        let house_number = chosen_range[0] + index
        buildings_vertical[index] = {
            type: "HOUSE",
            id: chosen_street_1 + "_" + house_number,
            street: chosen_street_1,
            houseNumber: house_number,
            col: building_positions_vertical[index].col,
            row: building_positions_vertical[index].row
        }
    }

    return {
        BuildingsHorizontal: buildings_horionztal,
        BuildingsVertical: buildings_vertical,
        ChosenRange: chosen_range
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