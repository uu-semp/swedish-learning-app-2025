export function GenerateBoard(question) {
    return {
        Horizontal: GenerateRoad("Horizontal", question),
        Vertical: GenerateRoad("Vertical", question),
    };
}

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
        street: street,
        buildings: buildings,
        correct_answer_building_id: correct_answer_building_id,
    };
}
