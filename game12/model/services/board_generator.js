export function GenerateBoard(streets, ranges, difficulty, landmarks) {
    if (difficulty === 1) {
        return GenerateT(streets, ranges, difficulty)
    }
    else {
        return GenerateHorizontal(streets, ranges,  landmarks)
    }
}


// Straight street for difficulty 2 and 3
function GenerateHorizontal(streets, ranges, landmarks) {
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

    let chosen_street_1 = streets[Math.floor((Math.random() * streets.length))]

    let chosen_range = ranges[Math.floor((Math.random() * ranges.length))]

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


    //Random selector for the landmarks 
    let chosen_landmark = landmarks[Math.floor((Math.random() * landmarks.length))]

    // Replace the top middle house with the chosen Landmark
    let landmark = buildings_horionztal[4]
    landmark.type = "LANDMARK"
    landmark.nameSwedish = chosen_landmark.sv
    landmark.nameEnglish = chosen_landmark.en
    landmark.image = chosen_landmark.img

    return {
        BuildingsHorizontal: buildings_horionztal,
        ChosenRange: chosen_range,
        HorizontalStreet: chosen_street_1,
        Landmark: landmark
    }
}

// Two streets in a T shape (T section) for difficulty 1
function GenerateT(streets, ranges) {
    // Alternate between the two sides to keep odd on one side and even numbers on the other side. 
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

    let chosen_street_1 = streets[Math.floor((Math.random() * streets.length))]
    streets = streets.filter(street => street !== chosen_street_1)
    let chosen_street_2 = streets[Math.floor((Math.random() * streets.length))]

    let chosen_range = ranges[Math.floor((Math.random() * ranges.length))]

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
            id: chosen_street_2 + "_" + house_number,
            street: chosen_street_2,
            houseNumber: house_number,
            col: building_positions_vertical[index].col,
            row: building_positions_vertical[index].row
        }
    }

    return {
        BuildingsHorizontal: buildings_horionztal,
        BuildingsVertical: buildings_vertical,
        ChosenRange: chosen_range,
        HorizontalStreet: chosen_street_1,
        VerticalStreet: chosen_street_2
    }
}
