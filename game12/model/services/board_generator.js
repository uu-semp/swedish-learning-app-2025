import { Question } from '../../model/classes/question'
import { BoardType } from '../../model/classes/enums'
import { Building } from '../../model/classes/enums';

export function GenerateBoard(question) {
    return GenerateRoad("Horizontal", question)
}

function GenerateRoad(road_type, question) {
    // Create a range for the house numbers.
    const range_offset = Math.floor(Math.random * 8)
    const range_start = null;

    // If the house number is specified, base the range on that. Otherwise, create a random range
    if (question.number) {
        range_start = Math.max(question.number - range_offset, 1)
        range_start = Math.min(range_start, 91)
    }
    else {
        //create random range TODO
    }

    const range = [range_start, range_start + 8]
    const correct_answer_building_id = null;

    // "place" the buildings
    const buildings = []
    for (let index = 0; index < 8; index++) {
        const house_number = index + range[0]
        const id = road_type + "_" + house_number
        buildings[i] = [id, Building.HOUSE]

        if (house_number == question.number) {
            correct_answer_building_id = id
        }
    }

    return {
        correct_answer_building_id: correct_answer_building_id,
        buildings: buildings
    }
}